import { runSafeScript } from "./lib/basicLib.js";
import { _beep2 } from "./sounds/beep2.js"

/** @param {NS} ns **/
export async function main(ns) {
	//ns.tail()
	ns.disableLog('purchaseAugmentation')
	let player = ns.getPlayer()
	let favor = 150;
	//let minMoney=500000000;
	var pathFaction; var pathAugment; var factionName = null;
	let file = ns.read("/singularity/player/gang.txt")
	if (file != "") {
		factionName = file.split(',')[0].split(':')[1]
	}
	let comp = []; let fact = []; let crime = []; let hak = []; let other = [];
	let count = 2; let augments; let focus = true; var maxPrice = 0; var minRep = 10e21;
	let special = [/*"The Red Pill", */"Neuroreceptor Management Implant", "CashRoot Starter Kit", "BitRunners Neurolink"];
	await runSafeScript(ns, "/singularity/getMyAugments.js")
	let installed = ns.read("/singularity/player/installedAugments.txt").split(',')
	let purchased = ns.read("/singularity/player/purchasedAugments.txt").split(',')
	let toBuy = []
	var ownAugments = installed.concat(purchased)
	if (installed.includes("Neuroreceptor Management Implant"))
		focus = false
	let factions = player.factions
	await ns.write("/singularity/player/factions.txt", factions, 'w')
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
				if (data !== "") {
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
	}
	//ns.tprint(rep.length+" "+crime.length+" "+hak.length)
	//ns.tprint(other)
	let aux = comp.concat(fact).concat(hak).concat(crime)//concat(other)
	let buyOther = aux.length == 0
	await buyLoop(aux)
	if (factionName != null) {
		if (aux.length == 0)
			aux.concat(other)
		aux.forEach((e) => e[0] = factionName)
		await buyLoop(aux)
	}
	if (buyOther) {
		await buyLoop(other);
	}
	await ns.write("/singularity/player/maxPrice.txt", maxPrice, 'w')
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
		let pid; let notScript = false;
		ns.kill("all.js", "home", true)
		if (ns.kill("stockTest.js", "home")) {
			do {
				pid = ns.run("stockTest.js", 1, true)
			} while (pid == 0)
			await ns.write("_tempStockPid.txt", pid, 'w')
		} else if (ns.read("_tempStockPid.txt") == "") {
			notScript = true;
		}
		pid = ns.read("_tempStockPid.txt")
		if (notScript || (pid != "" && !ns.isRunning(parseInt(pid)))) {
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
	}
	if (!player.isWorking && player.hacking > 2500 && (player.strength < 1200 || player.defense < 1200 || player.dexterity < 1200 || player.agility < 1200))
		ns.run("/singularity/gym.js")
	await ns.write("/singularity/player/augmentsToBuy.txt", toBuy, 'w')

	async function buyLoop(array = []) {
		let file = ns.read("/singularity/augments/augsPrice.txt"); let augsPrice;
		for (let i = 0; i < array.length; i++) {
			file.includes(array[i][1]) ? null : await runSafeScript(ns, "/singularity/augmentationPrice.js")
			augsPrice = file.split('\n')
			let aux = augsPrice.filter((a) => a.includes(array[i][1])).toString().split(',')
			let augPrice = aux[1]; let augRep = aux[2];
			let factionRep = ns.getFactionRep(array[i][0]);

			if (augPrice > maxPrice) {
				maxPrice = augPrice;
			}
			if (minRep > augRep) {
				minRep = augRep;
			}
			if (factionRep < augRep) {
				if (augPrice < player.money) {
					await runSafeScript(ns, "/singularity/donateFaction.js", array[i][0], Math.pow(10,parseInt(player.money).toString().length-2))
				}
				if (!player.isWorking) {
					await runSafeScript(ns, "/singularity/workForFaction.js", array[i][0], "hacking", focus)
				} else if (player.workType == "Working for Faction") {
					if (player.currentWorkFactionName == array[i][0] && factionRep + player.workRepGained >= augRep) {
						ns.stopAction()
					}
					if (player.currentWorkFactionName !== array[i][0] && (ns.getFactionFavor(array[i][0]) < favor && factionRep < ns.getFactionRep(player.currentWorkFactionName) + player.workRepGained)) {
						ns.stopAction();
						await runSafeScript(ns, "/singularity/workForFaction.js", array[i][0], "hacking", focus)
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