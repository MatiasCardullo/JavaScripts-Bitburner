import { runSafeScript, runScript } from "./lib/basicLib.js";

/** @param {NS} ns **/
export async function main(ns) {
	//ns.tail()
	//ns.disableLog('sleep')
	ns.disableLog('run')
	await runScript(ns, "/singularity/getMyAugments.js")
	let player = JSON.parse(ns.read("/logs/playerStats.txt"))
	let myServers = ns.read("myServers.txt").split(',').length
	let favor = 150;
	var pathFaction; var pathAugment;
	let comp = []; let fact = []; let crime = []; let hak = []; let other = [];
	let count = Math.ceil(player.hacking / 3000); let augments; let focus = true; var maxPrice = 0; var minPrice = null; var first = null;
	let special = ["The Red Pill", "Neuroreceptor Management Implant", "CashRoot Starter Kit", "BitRunners Neurolink"];
	let toBuy = []
	let installed = ns.read("/logs/installedAugments.txt").split(',')
	let purchased = ns.read("/logs/purchasedAugments.txt").split(',')
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
		if (!player.factions.includes(companyFactions[h])) {
			getRepComp = true; break;
		}
	}
	for (let h = 0; h < player.factions.length; h++) {
		await runScript(ns, "/factions/getRep.js", factions[h]);
		await runScript(ns, "/factions/getFavor.js", factions[h]);
		pathFaction = "/factions/" + player.factions[h].replaceAll(' ', '').replace('&', 'And') + "/augments.txt"
		augments = ns.read(pathFaction)
		if (augments == "") {
			await runSafeScript(ns, "/singularity/factionsAugments.js", player.factions[h]);
		}
		augments = augments.split(',')
		for (let i = 0; i < augments.length; i++) {
			pathAugment = "/augments/" + augments[i].replaceAll(' ', '').replace("'", '').replace("(S.N.A)", "") + ".txt";
			let data = ns.read(pathAugment)
			if (data == "") {
				await runSafeScript(ns, "/augments/getStats.js", augments[i])
				data = ns.read(pathAugment)
			}
			if (!ownAugments.includes(augments[i]) && "NeuroFlux Governor" != augments[i]) {
				if (special.includes(augments[i])) {
					await buyLoop([[player.factions[h], augments[i]]], true); continue;
				}
				if (data != "") {
					//ns.tprint(data[j])
					if (getRepComp && (data.includes("charisma") || data.includes("compan"))) {
						comp.push([player.factions[h], augments[i]])
					} else if (data.includes("faction")) {
						fact.push([player.factions[h], augments[i]])
					} else if (data.includes("crime")) {
						crime.push([player.factions[h], augments[i]])
					} else if (data.includes("weak") || data.includes("grow") || (data.includes("hack") && !data.includes("hacknet"))) {
						hak.push([player.factions[h], augments[i]])
					} else {
						other.push([player.factions[h], augments[i]])
					}
				} else {
					other.push([player.factions[h], augments[i]])
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
	let install = 0;
	for (let i = 0; i < purchased.length; i++) {
		if (special.includes(purchased[i])) {
			install++;
		}
		pathAugment = "/augments/" + purchased[i].replaceAll(' ', '').replace("'", '').replace("(S.N.A)", "") + ".txt";
		let data = ns.read(pathAugment);
		if (data.includes("rep") || data.includes("crime") || data.includes("weak") || data.includes("grow") || (data.includes("hack") && !data.includes("hacknet"))) {
			install++;
		}
		//ns.tprint(install+' '+count)
		if (install >= count)
			break;
	}
	if (install >= count || (toBuy.length == 0 && player.factions.includes("Illuminati") || purchased.includes("The Red Pill"))) {
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
			for (let h = 0; h < player.factions.length; h++) {
				pathFaction = "/factions/" + player.factions[h].replaceAll(' ', '').replace('&', 'And') + "/augments.txt"
				augments = ns.read(pathFaction).split(',')
				for (let i = 0; i < augments.length; i++) {
					if (ns.singularity.purchaseAugmentation(player.factions[h], augments[i])) {
						let output = "Purchased " + augments[i] + " from " + factions[h]
						ns.toast(output, "success", 60000)
					}
				}
			}
			for (let h = 0; h < player.factions.length; h++)
				while (ns.singularity.purchaseAugmentation(player.factions[h], "NeuroFlux Governor")) { }
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
	await ns.write("/logs/maxPrice.txt", maxPrice, 'w')
	await ns.write("/logs/minPrice.txt", minPrice, 'w')
	await ns.write("/logs/firstAugment.txt", first, 'w')
	await ns.write("/logs/augmentsToBuy.txt", toBuy, 'w')

	async function buyLoop(array = []) {
		await runSafeScript(ns, "/augments/getPrice.js")
		let augsPrice = ns.read("/augments/augsPrice.txt").split('\n');
		for (let i = 0; i < array.length; i++) {
			let aux = augsPrice.filter((a) => a.includes(array[i][1])).toString().split(',')
			let augPrice = parseFloat(aux[1]);
			if (augPrice > maxPrice)
				maxPrice = augPrice;
			if (minPrice == null || minPrice > augPrice) {
				first = array[i][1]
				minPrice = augPrice;
			}
		}
		for (let i = 0; i < array.length; i++) {
			await runSafeScript(ns, "getPlayer.js")
			player = JSON.parse(ns.read("/logs/playerStats.txt"))
			let aux = augsPrice.filter((a) => a.includes(array[i][1])).toString().split(',')
			let augPrice = parseFloat(aux[1]); let augRep = parseFloat(aux[2]);
			let path = "/factions/" + array[i][0].replaceAll(' ', '').replace('&', 'And');
			let factionRep = parseFloat(ns.read(path + "/reputation.txt"));
			let factionFavor = parseFloat(ns.read(path + "/favor.txt"));
			if (factionRep < augRep && (myServers == 25 || ns.read("/logs/firstAugment.txt") == array[i][1])) {
				if (factionFavor > favor && augPrice < player.money)
					await runSafeScript(ns, "/singularity/donateFaction.js", array[i][0], player.money - augPrice * (1 + purchased.length));
				if (!player.isWorking) {
					await runSafeScript(ns, "/singularity/workForFaction.js", array[i][0], focus);
				} else if (player.workType == "Working for Faction") {
					if (player.currentWorkFactionName == array[i][0] && (factionRep + player.workRepGained >= augRep /*|| minPrice !== augPrice*/))
						ns.singularity.stopAction();
					if (player.currentWorkFactionName !== array[i][0] && factionFavor < favor &&
						factionRep < parseFloat(ns.read("/factions/" + player.currentWorkFactionName.replaceAll(' ', '').replace('&', 'And') + "/reputation.txt")) + player.workRepGained)
						await runSafeScript(ns, "/singularity/workForFaction.js", array[i][0], "hacking", focus);
				}
			}
			if (!toBuy.includes(array[i][1]))
				toBuy.push(array[i][1])
			await runSafeScript(ns, "/singularity/purchaseAugmentation.js", array[i][0], array[i][1])
		}
	}
}