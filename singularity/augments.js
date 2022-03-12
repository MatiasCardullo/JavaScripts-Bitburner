import { _beep2 } from "./sounds/beep2.js"
import { _chargeSound } from "./sounds/chargeSound.js"

/** @param {NS} ns **/
export async function main(ns) {
	//ns.tail()
	let player=ns.getPlayer()
	let count = 4
	let rep = [];
	let crime = [];
	let hak = [];
	let augments;
	let focus = true;
	var ownAugments = ns.getOwnedAugmentations(true)
	if (ns.getOwnedAugmentations().includes("Neuroreceptor Management Implant"))
		focus = false
	
	let factions = player.factions
	for (let h = 0; h < factions.length; h++) {
		augments = ns.getAugmentationsFromFaction(factions[h]);
		for (let i = 0; i < augments.length; i++) {
			if (!ownAugments.includes(augments[i]) && augments[i] !== "NeuroFlux Governor") {
				let data = ns.getAugmentationStats(augments[i]);
				if (augments[i] == "The Red Pill" || augments[i] == "Neuroreceptor Management Implant") {
					await buyLoop([[factions[h], augments[i]]]);
				}
				//ns.tprint(data)
				for (var key in data) {
					if (key.includes("rep")) {
						rep.push([factions[h], augments[i]])
					} else if (key.includes("crime")) {
						crime.push([factions[h], augments[i]])
					} else if (key.includes("hack")) {
						hak.push([factions[h], augments[i]])
					} else {
						//other.push([factions[h],augments[i]])
					}
				}
			}
		}
	}

	if (rep.length> 0) {
		await buyLoop(rep);
	}else if (hak.length> 0) {
		await buyLoop(hak);
	}else if (crime.length> 0) {
		await buyLoop(crime);
	}

	let augs = ownAugments.length - ns.getOwnedAugmentations(false).length
	if (augs >= count) {
		ns.kill("all.js", "home", true)
		if (ns.kill("stockTest.js", "home"))
			ns.exec("sellAll.js", "home")

		for (let h = 0; h < factions.length; h++) {
			augments = ns.getAugmentationsFromFaction(factions[h]);
			for (let i = 0; i < augments.length; i++) {
				ns.purchaseAugmentation(factions[h], augments[i])
			}
		}

		for (let h = 0; h < factions.length; h++)
			while (ns.purchaseAugmentation(factions[h], "NeuroFlux Governor")) { }

		ns.stopAction()
		await ns.sleep(5000)
		new Audio("data:audio/wav;base64," + _chargeSound).play()
		ns.installAugmentations("autoStart.js")
	}

	async function buyLoop(array) {
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
				}else if (player.workType == "Working for Faction"){
					if(player.currentWorkFactionName == array[i][0]	&& ns.getFactionRep(array[i][0]) + player.workRepGained >= ns.getAugmentationRepReq(array[i][1]))
						ns.stopAction()
					if(player.currentWorkFactionName !== array[i][0] && ns.getFactionRep(array[i][0]) >ns.getFactionRep(player.currentWorkFactionName)+player.workRepGained){
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

	function workFaction(faction){
		if (!ns.workForFaction(faction, "Security Work", focus)) {
			if (!ns.workForFaction(faction, "Field Work", focus)) {
				ns.workForFaction(faction, "Hacking Contracts", focus)
			}
		}
	}
}