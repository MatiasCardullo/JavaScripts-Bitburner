import { runSafeScript, runScript } from "./lib/basicLib.js";
import { speak } from "./lib/voice.js";

/** @param {NS} ns **/
export async function main(ns) {
	//ns.tail()
	//ns.disableLog('sleep')
	ns.disableLog('run')
	await runScript(ns, "/singularity/getMyAugments.js")
	let player = ns.getPlayer()
	let favor = 75;
	var pathFaction; var pathAugment;
	let comp = []; let fact = []; let crime = []; let hak = []; let other = [];
	let count = 1 + Math.ceil(player.hacking / 3000); let augments; let focus = true; var maxPrice = 0; var minPrice = null;
	let special = [/*"The Red Pill",*/ "Neuroreceptor Management Implant", "CashRoot Starter Kit", "BitRunners Neurolink"];
	let toBuy = []
	let installed = ns.read("/logs/installedAugments.txt").split(',')
	let purchased = ns.read("/logs/purchasedAugments.txt").split(',')
	var ownAugments = installed.concat(purchased)
	if (installed.includes("Neuroreceptor Management Implant"))
		focus = false
	let factions = player.factions
	await ns.write("/logs/factions.txt", factions, 'w')
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
		await runScript(ns, "/singularity/factionsRep.js", factions[h]);
		await runScript(ns, "/singularity/factionsFavor.js", factions[h]);
		pathFaction = "/factions/" + factions[h].replaceAll(' ', '').replace('&', 'And') + "/augments.txt"
		augments = ns.read(pathFaction)
		if (augments == "") {
			await runSafeScript(ns, "/singularity/factionsAugments.js", factions[h]);
		}
		augments = augments.split(',')
		for (let i = 0; i < augments.length; i++) {
			pathAugment = "/augments/" + augments[i].replaceAll(' ', '').replace("'", '').replace("(S.N.A)", "") + ".txt";
			let data = ns.read(pathAugment)
			if (data == "") {
				await runSafeScript(ns, "/singularity/augmentationStats.js", augments[i])
				data = ns.read(pathAugment)
			}
			if (!ownAugments.includes(augments[i]) && "NeuroFlux Governor" != augments[i]) {
				if (special.includes(augments[i])) {
					await buyLoop([[factions[h], augments[i]]], true); continue;
				}
				if (data != "") {
					//ns.tprint(data[j])
					if (getRepComp && (data.includes("charisma") || data.includes("compan"))) {
						comp.push([factions[h], augments[i]])
					} else if (data.includes("faction")) {
						fact.push([factions[h], augments[i]])
					} else if (data.includes("crime")) {
						crime.push([factions[h], augments[i]])
					} else if (data.includes("weak") || data.includes("grow") || (data.includes("hack") && !data.includes("hacknet"))) {
						hak.push([factions[h], augments[i]])
					} else {
						other.push([factions[h], augments[i]])
					}
				} else {
					other.push([factions[h], augments[i]])
				}
			}
		}
	}
	//ns.tprint(rep.length+" "+crime.length+" "+hak.length)
	//ns.tprint(other)
	let aux = comp.concat(fact).concat(hak).concat(crime)//concat(other)
	let buyOther = aux.length == 0
	await buyLoop(aux)
	if (buyOther) {
		await buyLoop(other);
	}
	await ns.write("/logs/maxPrice.txt", maxPrice, 'w')
	await ns.write("/logs/minPrice.txt", minPrice, 'w')
	let install = 0;
	for (let i = 0; i < purchased.length; i++) {
		if (special.includes(purchased[i])) {
			install++;
		}
		pathAugment = "/augments/" + purchased[i].replaceAll(' ', '').replace("'", '').replace("(S.N.A)", "") + ".txt";
		let data = ns.read(pathAugment);
		if (data.includes("rep") || data.includes("weak") || data.includes("grow") || (data.includes("hack") && !data.includes("hacknet"))) {
			install++;
		}
		if (data.includes("crime") || data.includes("charisma")) {
			install+=1001/3000;
		}
		//ns.tprint(install)
		if (install >= count)
			break;
	}
	if (install >= count || (toBuy.length == 0 && factions.includes("Illuminati"))) {
		let pid; let notScript = false;
		ns.kill("all.js", "home", true)
		if (ns.kill("/stock/market.js", "home")) {
			do {
				pid = ns.run("/stock/market.js", 1, true)
			} while (pid == 0)
			await ns.write("/stock/_tempStockPid.txt", pid, 'w')
		} else if (ns.read("/stock/_tempStockPid.txt") == "") {
			notScript = true;
		}
		pid = ns.read("/stock/_tempStockPid.txt")
		if (notScript || (pid != "" && !ns.isRunning(parseInt(pid)))) {
			await buyLoop(other);
			for (let h = 0; h < factions.length; h++) {
				pathFaction = "/factions/" + factions[h].replaceAll(' ', '').replace('&', 'And') + "/augments.txt"
				augments = ns.read(pathFaction).split(',')
				for (let i = 0; i < augments.length; i++) {
					if (ns.purchaseAugmentation(factions[h], augments[i])) {
						let output = "Purchased " + augments[i] + " from " + factions[h]
						speak(output, 11)
						ns.toast(output, "success", 60000)
					}
				}
			}
			for (let h = 0; h < factions.length; h++)
				while (ns.purchaseAugmentation(factions[h], "NeuroFlux Governor")) { }
			ns.run("/singularity/installAugs.js")
		}
	}
	if (!player.isWorking && player.hacking > 2500 && (player.strength < 1200 || player.defense < 1200 || player.dexterity < 1200 || player.agility < 1200)) {
		if (ns.read("/logs/allCompanies.txt") == "true") {
			await runScript(ns, "/singularity/gym.js")
		} else {
			await ns.write("/logs/company.txt", "", 'w')
		}

	}
	await ns.write("/logs/augmentsToBuy.txt", toBuy, 'w')

	async function buyLoop(array = []) {
		let file = ns.read("/augments/augsPrice.txt"); let augsPrice;
		for (let i = 0; i < array.length; i++) {
			if (!file.includes(array[i][1])) {
				//ns.tprint(array[i][1])
				await runSafeScript(ns, "/singularity/augmentationPrice.js")
			}
			augsPrice = file.split('\n')
			let aux = augsPrice.filter((a) => a.includes(array[i][1])).toString().split(',')
			let augPrice = parseInt(aux[1]); let augRep = parseFloat(aux[2]);
			let path = "/factions/" + array[i][0].replaceAll(' ', '').replace('&', 'And');
			let factionRep = parseFloat(ns.read(path + "/reputation.txt"));
			let factionFavor = parseFloat(ns.read(path + "/favor.txt"));

			if (augPrice > maxPrice)
				maxPrice = augPrice;
			if (minPrice == null || minPrice > augPrice)
				minPrice = augPrice;
			if (factionRep < augRep) {
				if (factionFavor > favor && augPrice < player.money && ns.read("myServers.txt").split(',').length == 25)
					await runScript(ns, "/singularity/donateFaction.js", array[i][0], player.money - augPrice);
				if (!player.isWorking) {
					await runScript(ns, "/singularity/workForFaction.js", array[i][0], "hacking", focus);
				} else if (player.workType == "Working for Faction") {
					if (player.currentWorkFactionName == array[i][0] && factionRep + player.workRepGained >= augRep)
						ns.stopAction();
					if (player.currentWorkFactionName !== array[i][0] &&
						factionRep > parseFloat(ns.read("/factions/" + player.currentWorkFactionName.replaceAll(' ', '').replace('&', 'And') + "/reputation.txt")) + player.workRepGained)
						await runScript(ns, "/singularity/workForFaction.js", array[i][0], "hacking", focus);
				}
			}
			if (ns.purchaseAugmentation(array[i][0], array[i][1])) {
				let output = "Purchased " + array[i][1] + " from " + array[i][0]
				speak(output, 11)
				ns.toast(output, "success", 60000)
			} else if (!toBuy.includes(array[i][1]))
				toBuy.push(array[i][1])
		}
	}
}