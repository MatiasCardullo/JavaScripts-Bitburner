import { runSafeScript, runScript } from "./lib/basicLib.js";
import { selectCrime } from "./singularity/crime.js";

/** @param {NS} ns */
export async function main(ns) {
	//ns.tail()
	let working = false
	let count = parseInt(ns.read("/sleeves/count.txt"))
	let player = JSON.parse(ns.read("/logs/playerStats.txt"))
	let fact = JSON.parse(ns.read("/factions/toWork.txt"))
	let keyAugNames = JSON.parse(ns.read("/augments/names.txt"))
	let factKey = []; let job = []
	let gang = ns.read("/gang/info.txt")
	if (gang != "")
		gang = JSON.parse(gang).faction
	for (let key in fact) {
		if (key == gang || key == "Bladeburners" || key == "Church of the Machine God" || fact[key] < parseFloat(ns.read("/factions/" + key.replaceAll(' ', '').replace('&', 'And') + "/reputation.txt")))
			fact[key] = undefined
		else
			factKey.push(key)
	}
	//ns.tprint(JSON.stringify(fact))
	let companyFactions = ["MegaCorp", "ECorp", "Clarke Incorporated", "Bachman & Associates", "NWO", "KuaiGong International",
		"Four Sigma", "Blade Industries", "OmniTek Incorporated", "Fulcrum Secret Technologies"]

	let jobType;
	if (player.strength >= 275 && player.defense >= 275 && player.dexterity >= 275 && player.agility >= 275 && player.charisma >= 225)
		jobType = "security"
	else if (player.hacking >= 250)
		jobType = "software"
	if (jobType != null) {
		for (let i in companyFactions) {
			if (player.jobs[companyFactions[i].replace("Secret ", '')] == null && !player.isWorking)
				await runSafeScript(ns, "/company/apply.js", companyFactions[i].replace("Secret ", ''), jobType)
			if (!player.factions.includes(companyFactions[i]))
				job.push(companyFactions[i].replace("Secret ", ''))
		}
		ns.print(job)
	}

	await runSafeScript(ns, "/sleeves/getStats.js")
	await runSafeScript(ns, "/sleeves/getInfo.js")
	await runSafeScript(ns, "/sleeves/getPurchasableAugs.js")
	let bladeburner = ns.read("/bladeburner/actions.txt")
	if (bladeburner != "") {
		bladeburner = JSON.parse(bladeburner).contracts.reverse()
	} else {
		bladeburner = []
	}

	for (let s = 0; s < count; s++) {
		await runSafeScript(ns, "sleeves/getTask.js", s)
		let stats = JSON.parse(ns.read("/sleeves/" + s + "/stats.txt"))
		//let info = JSON.parse(ns.read("/sleeves/" + s + "/info.txt"))
		let task = JSON.parse(ns.read("/sleeves/" + s + "/task.txt"))
		ns.print(JSON.stringify(task))
		if (stats.shock > 0) {
			if (task.type != "Recovery")
				await runSafeScript(ns, "/sleeves/setToShockRecovery.js", s)
		} else if (stats.sync < 100) {
			if (task.type != "Synchro")
				await runSafeScript(ns, "/sleeves/setToSynchronize.js", s)
		} else {
			if (factKey.length > 0 && gang != "") {
				if (task.location != factKey[0] || task.type == "Company")
					await runSafeScript(ns, "/sleeves/setToFaction.js", s, factKey[0])
				factKey.shift()
			} else if (bladeburner.length > 0 && gang != "") {
				working = true
				//if (task.type != "Bladeburner" || "This will generate additional contracts and operations" == task.location) {
				let enough;
				do {
					await runSafeScript(ns, "/bladeburner/remaining/get.js", "Contracts", bladeburner[0])
					enough = parseInt(ns.read("/bladeburner/remaining/" + bladeburner[0].replaceAll(' ', '') + ".txt")) > 10
					if (enough && (task.type != "Bladeburner" || task.location == "This will generate additional contracts and operations")) {
						await runSafeScript(ns, "/sleeves/setToBladeburnerAction.js", s, "Take on contracts", bladeburner[0])
						bladeburner = [];
						break;
					} else if (50 < parseFloat(ns.read("/bladeburner/city/" + ns.read("/bladeburner/city/current.txt").replace(' ', '') + "/chaos.txt")))
						await runSafeScript(ns, "/sleeves/setToBladeburnerAction.js", s, "Diplomacy")
					bladeburner.shift()
				} while (bladeburner.length > 0 && !enough)
				if (bladeburner.length == 0 && !enough && task.type == "Idle") {
					await runSafeScript(ns, "/sleeves/setToBladeburnerAction.js", s, "Infiltrate synthoids")
				}
			} else if (job.length > 0 && gang != "") {
				await runSafeScript(ns, "/company/getRep.js", job[0])
				if (task.location != job[0] || task.type == "Faction")
					await runSafeScript(ns, "/sleeves/setToJob.js", s, job[0])
				job.shift()
			} else {
				await setCrime(s, stats, task)
			}
			await runSafeScript(ns, "sleeves/getTask.js", s)
			task = JSON.parse(ns.read("/sleeves/" + s + "/task.txt"))
			if (task.type == "Idle")
				await setCrime(s, stats, task)
			await buyAugs(s, task)
		}
	}
	await ns.write("/sleeves/state.txt", working, 'w')

	async function buyAugs(s, task) {
		let file = ns.read("/sleeves/" + s + "/augsToBuy.txt")
		if (file != "") {
			let listAugs = JSON.parse(file)
			for (let a in listAugs) {
				let data = listAugs[a].name; let buy = false;
				//data = data.replaceAll(' ', '').replace("'", '').replace(":", '').replace("(S.N.A)", "")
				data = ns.read("/augments/data/" + keyAugNames[data] + ".txt")
				if ((task.type == "Crime" && data.includes("crime") || data.includes("strength") || data.includes("defense") || data.includes("dexterity") || data.includes("agility"))
					|| (task.factionWorkType == "Hacking" && data.includes("hacking")) || ((task.factionWorkType == "Security" || task.factionWorkType == "Field") &&
						data.includes("strength") || data.includes("defense") || data.includes("dexterity") || data.includes("agility"))
					|| (task.type == "Faction" && data.includes("faction")) || (task.type == "Job" && data.includes("companies") || data.includes("charisma")))
					buy = true
				if (buy && listAugs[a].cost < player.money) {
					await runSafeScript(ns, "/sleeves/purchaseAug.js", s, listAugs[a].name)
				}
			}
		}
	}

	async function setCrime(s, stats, task) {
		let crimes = JSON.parse(ns.read("/logs/crimeStats.txt"))
		stats.intelligence = 1
		stats.crime_success_mult = 1
		let crime = selectCrime(ns, crimes, stats, false, 0.7)
		if (task.crime != crime)
			await runSafeScript(ns, "/sleeves/setToCommitCrime.js", s, crime)
	}
}