import { runSafeScript, runScript } from "./lib/basicLib.js";

/** @param {NS} ns **/
export async function main(ns) {
	//ns.disableLog('run')
	//ns.tail()
	ns.disableLog('disableLog')
	ns.disableLog('enableLog')
	ns.disableLog('sleep')
	let doCrime = ns.args[0]===true
	let enableGraft=ns.args[1]===true
	await runScript(ns, "/augments/get.js")
	let keyNames = JSON.parse(ns.read("/augments/names.txt"))
	let player = JSON.parse(ns.read("/logs/playerStats.txt"))
	let bnData = JSON.parse(ns.read("/logs/bitnodeMultipliers.txt"))
	let maxMyServers = 25 * bnData.PurchasedServerLimit
	let count = 0;
	count += player.hacking / 3000;
	let myServers = ns.read("myServers.txt")
	if (myServers != "") {
		myServers = myServers.split(',').length
		count += myServers / 6
	}
	let hacknetN = ns.read("/hacknet/count.txt")
	if (hacknetN != "") {
		count += parseInt(hacknetN) / 6
	}
	count -= player.entropy
	let sleeves = ns.read("/sleeves/count.txt") != ""
	let favor = 150;
	var pathFaction; var pathAugment;
	let all = []; let bb = []; let comp = []; let fact = []; let crime = []; let hak = []; let haknet = []; let other = [];
	let augments; let focus = true; var maxPrice = 0; var minPrice = null; var first = null;
	let special = ["The Red Pill", "Neuroreceptor Management Implant", "CashRoot Starter Kit", "BitRunners Neurolink", "The Blade's Simulacrum", "Stanek's Gift - Awakening", "Stanek's Gift - Serenity"];
	let toBuy = []; let factionToWork = {};
	let installed = ns.read("/augments/installed.txt")
	installed == "" ? installed = [] : installed = installed.split(',')
	let purchased = ns.read("/augments/purchased.txt")
	purchased == "" ? purchased = [] : purchased = purchased.split(',')
	let stnkAug = !installed.includes("Stanek's Gift - Genesis") ||
		(installed.includes("Stanek's Gift - Serenity") || purchased.includes("Stanek's Gift - Awakening") ||
			(installed.includes("Stanek's Gift - Awakening") && purchased.includes("Stanek's Gift - Serenity")))
	let graftAug = ns.read("/augments/grafting.txt").split(',')[0]
	var ownAugments = installed.concat(purchased)
	let bbDecision = !player.inBladeburner || (player.inBladeburner && installed.includes("The Blade's Simulacrum"))
	if (installed.includes("Neuroreceptor Management Implant"))
		focus = false
	let specialFactions = ["Bladeburners", "Church of the Machine God"]
	let cityFactions = ["Chongqing", "Sector-12", "Aevum", "New Tokyo", "Ishima", "Volhaven"]
	let companyFactions = ["MegaCorp", "Clarke Incorporated", "Bachman & Associates", "KuaiGong International",
		"ECorp", "NWO", "Four Sigma", "Blade Industries", "OmniTek Incorporated", "Fulcrum Secret Technologies"]
	let allFactions = ["Netburners", "CyberSec", "Tian Di Hui", "NiteSec", "The Black Hand", "BitRunners", "Slum Snakes", "Tetrads", "Silhouette", "Speakers for the Dead",
		"The Dark Army", "The Syndicate", "The Covenant", "Daedalus", "Illuminati"].concat(cityFactions).concat(companyFactions).concat(specialFactions)
	let gangF = ns.read("/gang/info.txt")
	if (gangF != "")
		gangF = JSON.parse(gangF).faction
	for (let h = 0; h < allFactions.length; h++) {
		if (player.factions.includes(allFactions[h])) {
			await runScript(ns, "/factions/getRep.js", allFactions[h]);
			await runScript(ns, "/factions/getFavor.js", allFactions[h]);
		}
		pathFaction = "/factions/" + allFactions[h].replaceAll(' ', '').replace(':', '').replace('&', 'And') + "/augments.txt"
		augments = ns.read(pathFaction)
		if (augments == "") {
			await runSafeScript(ns, "/factions/getAugments.js", allFactions[h]);
		}
		augments = augments.split(',')
		for (let i = 0; i < augments.length; i++) {
			pathAugment = "/augments/data/" + keyNames[augments[i]] + ".txt";
			//pathAugment = "/augments/data/" + augments[i].replaceAll(' ', '').replace("'", '').replace(':', '').replace("(S.N.A)", "") + ".txt";
			let data = ns.read(pathAugment)
			if (data == "") {
				await runSafeScript(ns, "/augments/getStats.js", augments[i])
				data = ns.read(pathAugment)
			}
			if (!ownAugments.includes(augments[i]) && "NeuroFlux Governor" != augments[i]) {
				if (player.factions.includes(allFactions[h])) {
					if (special.includes(augments[i])) {
						await buyLoop([[allFactions[h], augments[i]]], true);
					}
					if (data != "") {
						//ns.tprint(data[j])
						if (player.inBladeburner && (allFactions[h] == "Bladeburners" || data.includes("agility") || data.includes("dexterity"))) {
							bb.push([allFactions[h], augments[i]])
						} else if (/*getRepComp && */(data.includes("charisma") || data.includes("compan"))) {
							comp.push([allFactions[h], augments[i]])
						} else if (data.includes("faction")) {
							fact.push([allFactions[h], augments[i]])
						} else if (doCrime && data.includes("crime")) {
							crime.push([allFactions[h], augments[i]])
						} else if (data.includes("weak") || data.includes("grow") || (data.includes("hack") && !data.includes("hacknet"))) {
							hak.push([allFactions[h], augments[i]])
						} else if (hacknetN != "" && data.includes("hacknet")) {
							haknet.push([allFactions[h], augments[i]])
						} else if (!data.includes("hacknet")) {
							other.push([allFactions[h], augments[i]])
						}
					} else {
						other.push([allFactions[h], augments[i]])
					}
				}
			}
			if (!all.includes(augments[i]))
				all.push(augments[i])
		}
	}

	let aux = comp.length + fact.length + hak.length + crime.length
	if (player.inBladeburner)
		aux += bb.length
	if (hacknetN != "")
		aux += haknet.length
	if (aux == 0) {
		await buyLoop(other);
	} else {
		await buyLoop(fact)
		await buyLoop(haknet)
		if (bb.length == 0 || sleeves) {
			await buyLoop(comp)
			if (haknet.length == 0) {
				await buyLoop(hak)
			}
		}
		if (ownAugments.includes("The Blade's Simulacrum"))
			await buyLoop(bb)
		if (doCrime)
			await buyLoop(crime)
	}
	if (!player.isWorking && player.hacking > 2500 && (player.strength < 1200 || player.defense < 1200 || player.dexterity < 1200 || player.agility < 1200)) {
		if (ns.read("/logs/allCompanies.txt") == "true") {
			await runScript(ns, "/singularity/gym.js")
		} else {
			await ns.write("/logs/company.txt", "", 'w')
		}
	}

	if (purchased.length > 1 && graftAug == "" && (stnkAug || parseInt(ns.read("/hacknet/count.txt")) < purchased.length))
		await installing()
	ns.print(graftAug != "" && installed.includes(graftAug))
	if (enableGraft) {
		if (graftAug != "" && installed.includes(graftAug)) {
			await ns.write("/augments/grafting.txt", "", 'w')
		} else {
			let bb = ns.read("/bladeburner/currentAction.txt")
			bb == "" ? bb = true : bb = JSON.parse(bb).type != "BlackOp" || installed.includes("The Blade's Simulacrum")
			if (player.bitNodeN != 8 && purchased.length > 1 && bb)
				await grafting()
		}
	}

	await save("/factions/toWork.txt", JSON.stringify(factionToWork))
	await save("/augments/maxPrice.txt", maxPrice)
	await save("/augments/minPrice.txt", minPrice)
	await save("/augments/first.txt", first)
	await save("/augments/toBuy.txt", toBuy)
	await save("/augments/allAugments.txt", all.toString())

	async function save(file, data) {
		let f = ns.read(file)
		if (f != data)
			await ns.write(file, data, 'w')
	}

	async function buyLoop(array = []) {
		await runSafeScript(ns, "/augments/getPrice.js")
		let augsPrice = ns.read("/augments/augsPrice.txt").split('\n');
		for (let i = 0; i < array.length; i++) {
			let aux = augsPrice.filter((a) => a.includes(array[i][1])).toString().split(',')
			let augPrice = parseFloat(aux[1]);
			if (augPrice > maxPrice)
				maxPrice = augPrice;
			if (!specialFactions.includes(array[i][0]) && (minPrice == null || minPrice > augPrice)) {
				first = array[i][1]
				if (augPrice != 0)
					minPrice = augPrice;
			}
		}
		for (let i = 0; i < array.length; i++) {
			ns.disableLog("run")
			await runSafeScript(ns, "getPlayer.js")
			ns.enableLog("run")
			player = JSON.parse(ns.read("/logs/playerStats.txt"))
			let aux = augsPrice.filter((a) => a.includes(array[i][1])).toString().split(',')
			let augPrice = parseFloat(aux[1]); let augRep = parseFloat(aux[2]);
			let path = "/factions/" + array[i][0].replaceAll(' ', '').replace('&', 'And');
			let factionRep = parseFloat(ns.read(path + "/reputation.txt"));
			let factionFavor = parseFloat(ns.read(path + "/favor.txt"));
			if (factionRep < augRep) {
				if (sleeves || myServers == maxMyServers || (ns.read("/augments/first.txt") == array[i][1] && ns.read("/gang/info.txt") != "")) {
					if (factionFavor > favor && augPrice < player.money && augPrice !== graftAug && !specialFactions.includes(array[i][0]))
						await runSafeScript(ns, "/factions/donate.js", array[i][0], player.money - augPrice * (1 + purchased.length));
					if (!player.isWorking && bbDecision) {
						await runSafeScript(ns, "/factions/work.js", array[i][0], focus);
					} else if (player.workType == "Working for Faction") {
						if (player.currentWorkFactionName == array[i][0] && (factionRep + player.workRepGained >= augRep /*|| minPrice !== augPrice*/))
							await runSafeScript(ns, "/singularity/stopAction.js");
						if (player.currentWorkFactionName !== array[i][0] && factionFavor < favor && minPrice == augPrice &&
							factionRep > parseFloat(ns.read("/factions/" + player.currentWorkFactionName.replaceAll(' ', '').replace('&', 'And') + "/reputation.txt")) + player.workRepGained)
							await runSafeScript(ns, "/factions/work.js", array[i][0], "hacking", focus);
					}
				}
			} else if (graftAug != array[i][1] && augPrice < player.money)
				await runSafeScript(ns, "/augments/buy.js", array[i][0], array[i][1])
			if (graftAug != array[i][1] && !toBuy.includes(array[i][1]))
				toBuy.push(array[i][1])
			if (graftAug != array[i][1] && (factionToWork[array[i][0]] == null || factionToWork[array[i][0]] < augRep))
				factionToWork[array[i][0]] = augRep
		}
	}

	async function grafting() {
		let graft = ns.read("/augments/graftables.txt");
		if (graftAug == "") {
			let graftArray = graft.split(',');
			let graftPrices = ns.read("/augments/graftPrices.txt").split(',');
			let sort = true;
			while (sort) {
				sort = false;
				for (let i = 1; i < graftPrices.length; i += 1) {
					if (parseInt(graftPrices[i - 1]) < parseInt(graftPrices[i])) {
						let tmp; sort = true;
						tmp = graftPrices[i - 1];
						graftPrices[i - 1] = graftPrices[i];
						graftPrices[i] = tmp;
						tmp = graftArray[i - 1];
						graftArray[i - 1] = graftArray[i];
						graftArray[i] = tmp;
					}
				}
			}
			for (let g = graftArray.length - 1; g > graftArray.length / 2; g--) {
				//ns.tprint(!all.includes(graftArray[g]),toBuy.includes(graftArray[g]), minPrice < graftPrices[g], graftPrices[g] > 0 && graftPrices[g] < player.money)
				if ((!all.includes(graftArray[g]) || (toBuy.includes(graftArray[g]) && minPrice > graftPrices[g])) && graftPrices[g] > 0 && graftPrices[g] < player.money) {

					ns.alert("")
					if (player.city != "New Tokyo")
						await runSafeScript(ns, "/singularity/travelToCity.js", "New Tokyo")
					await runSafeScript(ns, "/augments/graft.js", graftArray[g], focus)
					return;
				}
			}
		} else if (graft != "") {
			await runSafeScript(ns, "/augments/getGraftables.js")
			await runSafeScript(ns, "/augments/getGraftPrice.js")
		}
	}

	async function installing() {
		let install = 0; let installNow = false
		for (let i = 0; i < purchased.length; i++) {
			if (purchased[i] == "Stanek's Gift - Serenity") {
				installNow = true;
				break;
			}
			if (special.includes(purchased[i])) {
				install++;
			}
		}
		install += purchased.length
		ns.print(install + ' ' + count)
		if (install >= Math.floor(count) || (toBuy.length == 0 && player.factions.includes("Illuminati")) || installNow) {
			let pid; let notScript = false;
			let file = ns.read("/stock/_tempStockPid.txt")
			if (ns.isRunning("/stock/market.js", "home")) {
				ns.kill("/stock/market.js", "home")
				pid = await runScript(ns, "/stock/market.js", true)
				if (file == "")
					await ns.write("/stock/_tempStockPid.txt", pid, 'w')
			} else if (file == "") {
				notScript = true;
			}
			pid = ns.read("/stock/_tempStockPid.txt")
			if (notScript || (pid != "" && !ns.isRunning(parseInt(pid)))) {
				await buyLoop(other);
				for (let h = 0; h < player.factions.length; h++) {
					pathFaction = "/factions/" + player.factions[h].replaceAll(' ', '').replace('&', 'And') + "/augments.txt"
					augments = ns.read(pathFaction).split(',')
					for (let i = 0; i < augments.length; i++) {
						if (augments[i] != "" && !augments[i].includes("Hacknet") && augments[i] != "NeuroFlux Governor" && ns.singularity.purchaseAugmentation(player.factions[h], augments[i])) {
							let output = "Purchased " + augments[i] + " from " + player.factions[h]
							ns.toast(output, "success", 60000)
						}
					}
				}
				for (let h = 0; h < player.factions.length; h++)
					while (ns.singularity.purchaseAugmentation(player.factions[h], "NeuroFlux Governor")) { }
				ns.run("/augments/install.js")
			}
		}
	}
}