import { _beep2 } from "./sounds/beep2.js"
import { _chargeSound } from "./sounds/chargeSound.js"

/** @param {NS} ns **/
export async function main(ns) {
	//ns.tail()
	let player = ns.getPlayer()
	var pathFaction; var pathAugment;
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

	let factions = player.factions
	for (let h = 0; h < factions.length; h++) {
		pathFaction = "/singularity/factions/" + factions[h].replaceAll(' ', '').replace('&', 'And') + "Augments.txt"
		if (!ns.fileExists(pathFaction)) {
			ns.run("/singularity/factionsAugments.js", 1, factions[h])
			await ns.sleep(50);
		}
		augments = ns.read(pathFaction).split(',')
		for (let i = 0; i < augments.length; i++) {
			pathAugment = "/singularity/augments/" + augments[i].replaceAll(' ', '').replace("'", '').replace("(S.N.A)","")+ ".txt";
			if (!ns.fileExists(pathAugment)) {
				ns.run("/singularity/augmentationStats.js", 1, augments[i])
				await ns.sleep(50);
			}
			if (!ownAugments.includes(augments[i]) && augments[i] !== "NeuroFlux Governor") {
				if (augments[i] == "The Red Pill" || augments[i] == "Neuroreceptor Management Implant" || augments[i] == "CashRoot Starter Kit" || augments[i] == "BitRunners Neurolink") {
					await buyLoop([[factions[h], augments[i]]]); ns.exit();
				}
				let data = ns.read(pathAugment).split(',');
				//ns.tprint(data)
				for (let j = 0; j < data.length; j++) {
					//ns.tprint(data[j])
					if (data[j].includes("rep")) {
						rep.push([factions[h], augments[i]])
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
	//ns.tprint(rep.length+crime.length+hak.length)
	await buyLoop(rep);
	await buyLoop(hak);
	await buyLoop(crime);
	if (other.length > 0&&crime.length == 0&&hak.length == 0&&rep.length == 0) {
		await buyLoop(other);
	} else if(other.length == 0){
		ns.run("/singularity/gym.js");
	}
	let install = 0;
	for (let i = 0; i < purchased.length; i++) {
		pathAugment = "/singularity/augments/" + purchased[i].replaceAll(' ', '').replace("'", '').replace("(S.N.A)","")+ ".txt";
		let data = ns.read(pathAugment).split(',');
		for (let j = 0; j < data.length; j++) {
			if (data[j].includes("rep") || data[j].includes("crime") || data[j].includes("weak") || data[j].includes("grow") || data[j].includes("hack")) {
				install++;
				if (install >= count)
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

		ns.stopAction()
		new Audio("data:audio/wav;base64," + _chargeSound).play()
		await ns.sleep(5000)
		ns.installAugmentations("autoStart.js")
	}

	async function buyLoop(array, stopWork = true) {
		for (let i = 0; i < array.length; i++) {
			if (ns.getAugmentationPrice(array[i][1]) < player.money && array[i][1] !== "The Red Pill") {
				ns.kill("/singularity/crime.js", "home", true)
				ns.kill("/singularity/crime.js", "home", false)
			}/*else if(!ns.scriptRunning("/singularity/crime.js","home")){
				ns.exec("/singularity/crime.js","home",1,false)
			}*/
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