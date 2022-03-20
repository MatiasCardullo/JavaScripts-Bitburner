import { _beep2 } from "./sounds/beep2.js"

/** @param {NS} ns **/
export async function main(ns) {
	//ns.tail()
	let player = ns.getPlayer()
	var pathFaction; var pathAugment; var factionName=null;
	let file=ns.read("/singularity/player/gang.txt")
	if (file!=""){
		factionName = file.split(',')[0].split(':')[1]
	}
	let count = 3
	let rep = []; let crime = []; let hak = []; let other = [];
	let augments;
	let focus = true;

	ns.run("/singularity/getMyAugments.js")
	await ns.sleep(50)
	let installed = ns.read("/singularity/player/installedAugments.txt").split(',')
	let purchased = ns.read("/singularity/player/purchasedAugments.txt").split(',')
	var ownAugments = installed.concat(purchased)

	if (installed.includes("Neuroreceptor Management Implant"))
		focus = false

	let factions =player.factions
	let allFactions=["CyberSec","Tian Di Hui","Chongqing","New Tokyo", "Ishima", "Sector-12", "Aevum", "Volhaven","Nitesec","The Black Hand","BitRunners",
	"MegaCorp", "ECorp", "Clarke Incorporated", "Bachman & Associates", "NWO","KuaiGong International",
	"Four Sigma", "Blade Industries", "OmniTek Incorporated", "Fulcrum Secret Technologies",
	"Slum Snakes","Tetrads","Silhouette","Speakers for the Dead","The Dark Army",
	"The Syndicate","The Covenant","Daedalus","Illuminati"]
	let maxAugRep = [];
	for (let h = 0; h < factions.length; h++) {
		maxAugRep.push([factions[h], 0])
	}
	for (let h = 0; h < factions.length; h++) {
		pathFaction = "/singularity/factions/" + factions[h].replaceAll(' ', '').replace('&', 'And') + "Augments.txt"
		if (ns.read(pathFaction)=="") {
			ns.run("/singularity/factionsAugments.js", 1, factions[h])
			await ns.sleep(50);
		}
		augments = ns.read(pathFaction).split(',')
		for (let i = 0; i < augments.length; i++) {
			pathAugment = "/singularity/augments/" + augments[i].replaceAll(' ', '').replace("'", '').replace("(S.N.A)", "") + ".txt";
			if (ns.read(pathAugment)=="") {
				ns.run("/singularity/augmentationStats.js", 1, augments[i])
				await ns.sleep(50);
			}
			if (!ownAugments.includes(augments[i]) && augments[i] !== "NeuroFlux Governor") {
				if (augments[i] == "The Red Pill" || augments[i] == "Neuroreceptor Management Implant" || augments[i] == "CashRoot Starter Kit" || augments[i] == "BitRunners Neurolink") {
					//ns.tprint(factions[h]+" "+ augments[i])
					await buyLoop([[factions[h], augments[i]]]); continue;
				}
				let data = ns.read(pathAugment).split('\n');
				//ns.tprint(data)
				for (let j = 0; j < data.length; j++) {
					//ns.tprint(data[j])
					if (data[j].includes("rep")) {
						rep.push([factions[h], augments[i]])
					} else if (data[j].includes("crime")) {
						crime.push([factions[h], augments[i]])
					} else if (data[j].includes("weak") || data[j].includes("grow") || data[j].includes("hack ")) {
						hak.push([factions[h], augments[i]])
					} else {
						other.push([factions[h], augments[i]])
					}
				}
			}
		}
	}
	//ns.tprint(rep.length+" "+crime.length+" "+hak.length)
	//ns.tprint(other)
	await buyLoop(rep, !focus);
	await buyLoop(hak, !focus);
	await buyLoop(crime, !focus);
	let buyOther=other.length > 0 && crime.length == 0 && hak.length == 0 && rep.length == 0;
	if (factionName != null) {
		let aux=rep.concat(hak).concat(crime)
		if (buyOther) {
			aux=aux.concat(other)
		}
		aux.forEach((e)=>e[0]=factionName)
		await buyLoop(aux,!focus)
	}
	if (buyOther) {
		await buyLoop(other);
	} else if (other.length == 0) {

		//ns.run("/singularity/gym.js");
	}
	let install = 0;
	for (let i = 0; i < purchased.length; i++) {
		pathAugment = "/singularity/augments/" + purchased[i].replaceAll(' ', '').replace("'", '').replace("(S.N.A)", "") + ".txt";
		let data = ns.read(pathAugment).split(',');
		for (let j = 0; j < data.length; j++) {
			if (data[j].includes("rep") || data[j].includes("crime") || data[j].includes("weak") || data[j].includes("grow") || data[j].includes("hack")) {
				install++;
				break;
			}
		}
		if (install >= count)
			break;
	}
	if (install >= count) {
		ns.kill("all.js", "home", true)
		if (ns.kill("stockTest.js", "home"))
			ns.run("sellAll.js")

		for (let h = 0; h < factions.length; h++) {
			pathFaction = "/singularity/factions/" + factions[h].replaceAll(' ', '').replace('&', 'And') + "Augments.txt"
			augments = ns.read(pathFaction).split(',')
			for (let i = 0; i < augments.length; i++) {
				ns.purchaseAugmentation(factions[h], augments[i])
			}
		}

		for (let h = 0; h < factions.length; h++)
			while (ns.purchaseAugmentation(factions[h], "NeuroFlux Governor")) { }

		ns.run("/singularity/installAugs.js")
	}

	async function buyLoop(array, stopWork = true) {
		for (let i = 0; i < array.length; i++) {
			if (ns.getFactionRep(array[i][0]) < ns.getAugmentationRepReq(array[i][1])) {
				if (ns.getFactionFavor(array[i][0]) >= 150 && ns.getAugmentationPrice(array[i][1]) < player.money) {
					ns.donateToFaction(array[i][0], player.money - ns.getAugmentationPrice(array[i][1]))
				}
				if (!player.isWorking) {
					workFaction(array[i][0]);
				} else if (player.workType == "Working for Faction") {
					if (player.currentWorkFactionName == array[i][0] && ns.getFactionRep(array[i][0]) + player.workRepGained >= ns.getAugmentationRepReq(array[i][1]))
						ns.stopAction()
					if (stopWork && player.currentWorkFactionName !== array[i][0] &&
						ns.getFactionRep(array[i][0]) > ns.getFactionRep(player.currentWorkFactionName) + player.workRepGained) {
						ns.stopAction();
						workFaction(array[i][0]);
					}
				}
			}
			if (ns.purchaseAugmentation(array[i][0], array[i][1])) {
				new Audio("data:audio/wav;base64," + _beep2).play()
			}
			if (factionName != null) {
				if (ns.purchaseAugmentation(factionName, array[i][1])) {
					new Audio("data:audio/wav;base64," + _beep2).play()
				}
			}
		}
	}

	function workFaction(faction) {
		if (!ns.workForFaction(faction, "Security Work", focus)) {
			if (!ns.workForFaction(faction, "Field Work", focus)) {
				ns.workForFaction(faction, "Hacking Contracts", focus)
			}
		}
	}
}