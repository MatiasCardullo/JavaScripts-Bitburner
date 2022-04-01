import { runSafeScript } from "./lib/basicLib.js";
import { _beep2 } from "./sounds/beep2.js"

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('purchaseAugmentation')
	let player = ns.getPlayer()
	let favor = 0;
	//let minMoney=500000000;
	var pathFaction; var pathAugment; var factionName = null;
	let file = ns.read("/singularity/player/gang.txt")
	if (file != "") {
		factionName = file.split(',')[0].split(':')[1]
	}
	let count = 3
	let comp = []; let fact = []; let crime = []; let hak = []; let other = [];
	let augments;
	let focus = true;
	let special = ["The Red Pill", "Neuroreceptor Management Implant", "CashRoot Starter Kit", "BitRunners Neurolink"];
	await runSafeScript(ns, "/singularity/getMyAugments.js")
	let installed = ns.read("/singularity/player/installedAugments.txt").split(',')
	let purchased = ns.read("/singularity/player/purchasedAugments.txt").split(',')
	let toBuy = []
	var ownAugments = installed.concat(purchased)
	if (installed.includes("Neuroreceptor Management Implant"))
		focus = false

	let factions = player.factions
	let getRepComp = false;
	let companyFactions = ["MegaCorp", "ECorp", "Clarke Incorporated", "Bachman & Associates", "NWO", "KuaiGong International",
		"Four Sigma", "Blade Industries", "OmniTek Incorporated", "Fulcrum Secret Technologies"]
	let allFactions = ["CyberSec", "Tian Di Hui", "Chongqing", "New Tokyo", "Ishima", "Sector-12", "Aevum", "Volhaven", "Nitesec", "The Black Hand", "BitRunners",
		"Slum Snakes", "Tetrads", "Silhouette", "Speakers for the Dead", "The Dark Army",
		"The Syndicate", "The Covenant", "Daedalus", "Illuminati"].concat(companyFactions)
	for (let h = 0; h < companyFactions.length; h++) {
		if (!factions.includes(companyFactions[h])) {
			getRepComp = true; break;
		}
	}
	for (let h = 0; h < factions.length; h++) {
		pathFaction = "/singularity/factions/" + factions[h].replaceAll(' ', '').replace('&', 'And') + "Augments.txt"
		augments = ns.read(pathFaction)
		if (augments == "") {
			await runSafeScript(ns, "/singularity/factionsAugments.js", factions[h])
		}
		augments = augments.split(',')
		for (let i = 0; i < augments.length; i++) {
			pathAugment = "/singularity/augments/" + augments[i].replaceAll(' ', '').replace("'", '').replace("(S.N.A)", "") + ".txt";
			let data = ns.read(pathAugment)
			if (data == "") {
				await runSafeScript(ns, "/singularity/augmentationStats.js", augments[i])
			}
			if (!ownAugments.includes(augments[i]) && "NeuroFlux Governor" != augments[i]) {
				if (special.includes(augments[i])) {
					await buyLoop([[factions[h], augments[i]]], true); continue;
				}
				data = data.split('\n');
				//ns.tprint(data)
				for (let j = 0; j < data.length; j++) {
					//ns.tprint(data[j])
					if (getRepComp && data[j].includes("compan")) {
						comp.push([factions[h], augments[i]])
					} else if (data[j].includes("faction")) {
						fact.push([factions[h], augments[i]])
					} else if (data[j].includes("crime")) {
						crime.push([factions[h], augments[i]])
					} else if (data[j].includes("weak") || data[j].includes("grow") || data[j].includes("hack")) {
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
	await buyLoop(comp);
	await buyLoop(fact);
	await buyLoop(hak);
	await buyLoop(crime);
	let buyOther = crime.length == 0 && hak.length == 0 && comp.length == 0 && fact.length == 0;
	if (factionName != null) {
		let aux = comp.concat(fact).concat(hak).concat(crime)//concat(other)
		if (buyOther)
			aux = aux.concat(other)
		aux.forEach((e) => e[0] = factionName)
		await buyLoop(aux)
	}
	if (buyOther) {
		await buyLoop(other);
		if (other.length == 0 && !player.isWorking && player.strength < 1200 && player.defense < 1200 && player.dexterity < 1200 && player.agility < 1200)
			ns.run("/singularity/gym.js")
	}
	let install = 0;
	for (let i = 0; i < purchased.length; i++) {
		if (special.includes(purchased[i])) {
			install = count; break;
		}
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
		if (ns.kill("stockTest.js", "home")) {
			let pid = ns.run("stockTest.js", 1, true)
			while (ns.isRunning(pid)) { await ns.sleep(0) }
			ns.exit()
		}
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
		ns.exit()

	}

	await ns.write("/singularity/player/augmentsToBuy.txt", toBuy, 'w')

	async function buyLoop(array, changeWork = false) {
		for (let i = 0; i < array.length; i++) {
			if (ns.getFactionRep(array[i][0]) < ns.getAugmentationRepReq(array[i][1])) {
				if (ns.getFactionFavor(array[i][0]) >= favor && ns.getAugmentationPrice(array[i][1]) < player.money / 2) {
					ns.run("/singularity/donateFaction.js", 1, array[i][0], player.money / 4)
				}
				if (!player.isWorking) {
					ns.workForFaction(array[i][0], "Hacking Contracts", focus)
				} else if (player.workType == "Working for Faction") {
					if (player.currentWorkFactionName == array[i][0] && ns.getFactionRep(array[i][0]) + player.workRepGained >= ns.getAugmentationRepReq(array[i][1])) {
						ns.stopAction()
					}
					if (player.currentWorkFactionName !== array[i][0] &&
						ns.getFactionRep(array[i][0]) > ns.getFactionRep(player.currentWorkFactionName) + player.workRepGained) {
						ns.stopAction();
						ns.workForFaction(array[i][0], "Hacking Contracts", focus)
					}
				}
			}
			if (ns.purchaseAugmentation(array[i][0], array[i][1])) {
				new Audio("data:audio/wav;base64," + _beep2).play()
				ns.toast("Purchased Augmentation " + array[i][1] + " from " + array[i][0], "success", 60000)
			} else if (factionName != null && ns.purchaseAugmentation(factionName, array[i][1])) {
				new Audio("data:audio/wav;base64," + _beep2).play()
				ns.toast("Purchased Augmentation " + array[i][1] + " from " + array[i][0], "success", 60000)
			} else if (!toBuy.includes(array[i][1]))
				toBuy.push(array[i][1])
		}
	}
}