import { runSafeScript, runScript } from "./lib/basicLib.js";
import { speak } from "./sounds/voice.js";

/** @param {NS} ns */
export async function main(ns) {
	//ns.tail()
	ns.disableLog('sleep')
	let actions = ns.read("/bladeburner/actions.txt")
	if (actions == "") {
		await runSafeScript(ns, "/bladeburner/getActions.js")
		await runScript(ns, "/bladeburner/skill/getCost.js")
		await runScript(ns, "/bladeburner/skill/getLevel.js")
	}
	actions = JSON.parse(actions)
	let player = JSON.parse(ns.read("/logs/playerStats.txt"))
	let bbaug = ns.read("/logs/installedAugments.txt").includes("The Blade's Simulacrum")
	if (player.isWorking && !bbaug)
		await runScript(ns, "/singularity/stopAction.js")
	let cities = ["Sector-12", "Aevum", "Volhaven", "Chongqing", "New Tokyo", "Ishima"];
	await runSafeScript(ns, "/bladeburner/getStamina.js")
	let stamina = parseFloat(ns.read("/bladeburner/stamina.txt"))
	let maxStamina = parseFloat(ns.read("/bladeburner/maxStamina.txt"))
	await runSafeScript(ns, "/bladeburner/getCurrentAction.js")
	let action = JSON.parse(ns.read("/bladeburner/currentAction.txt"))
	let newAction = "";
	//ns.tprint(maxStamina == stamina, !actions.contracts.includes(action.name))
	if (actions.blackOps.includes(action.name)) {
		let file = "/bladeburner/doneBlackOps.txt"
		if (!ns.read(file).includes(action.name)) {
			let done = []
			for (let i = 0; i < actions.blackOps.length; i++) {
				done.push(actions.blackOps[i])
				if (actions.blackOps[i] == action.name)
					break;
			}
			let text = "Bladeburner: Executing " + action.name + ' ' + done.length
			await ns.write(file, done, 'w')
			speak(text + " of " + actions.blackOps.length, 11)
			ns.toast(text + '/' + actions.blackOps.length, "success", 360000)
		}
	} else {
		await runSafeScript(ns, "/bladeburner/city/get.js")
		let city = ns.read("/bladeburner/city/current.txt")
		await runSafeScript(ns, "/bladeburner/city/getPopulation.js", city)
		let pop = parseInt(ns.read("/bladeburner/city/" + city.replace(' ', '') + "/population.txt"))
		let popDown = false;
		if (1400000000 > pop) {
			//ns.toast(pop)
			popDown = true;
		}
		if (1010000000 > pop && action.name != "Hyperbolic Regeneration Chamber" && action.name != "Tracking" && action.name != "Investigation" && action.name != "Undercover Operation") {
			await runSafeScript(ns, "/bladeburner/stopAction.js")
			let i = cities.indexOf(city)
			if (i == cities.length - 1)
				i = 0
			else
				i++
			city = cities[i]
			await runScript(ns, "/bladeburner/city/switch.js", city)
		} else {
			await runScript(ns, "/bladeburner/city/getChaos.js", city)
			if (50 < parseFloat(ns.read("/bladeburner/city/" + city.replace(' ', '') + "/chaos.txt")) && action.name != "Diplomacy")
				await setAction("General", "Diplomacy")
		}
		if (125 > maxStamina) {
			if (action.name != "Training")
				await setAction("General", "Training")
		} else if (stamina < maxStamina / 3 || player.hp < player.max_hp / 3 || action.type == "Idle") {
			if (action.name != "Hyperbolic Regeneration Chamber")
				await setAction("General", "Hyperbolic Regeneration Chamber")
		} else {
			let chCon = await getChances("Contract")
			let chOp = await getChances("Operation")
			if (maxStamina * 0.99 < stamina) {
				if (50 > parseFloat(ns.read("/bladeburner/city/" + city.replace(' ', '') + "/chaos.txt"))) {
					let op; let c;
					if (!actions.operations.includes(action.name))
						op = await setOperations(popDown || chCon || chOp)
					if (!actions.contracts.includes(action.name) && !actions.operations.includes(action.name)) {
						c = await setContracts(popDown || chCon)
						if ((op || c) && !actions.contracts.includes(action.name) && !actions.operations.includes(action.name)) {
							if (action.name != "Training" && action.name != "Hyperbolic Regeneration Chamber")
								await setAction("General", "Training")
						} else if (action.type != "Incite Violence") {
							await setAction("General", "Incite Violence")
						}
					}
				}
			} else if (maxStamina * 2 / 3 > stamina && action.name == "Training") {
				await setAction("General", "Hyperbolic Regeneration Chamber")
			}
			while (await setSkill() > 0) {
				await runScript(ns, "/bladeburner/skill/getCost.js")
				await runScript(ns, "/bladeburner/skill/getLevel.js")
			}
			await setBlackOps()
		}
		let log = ns.read("/logs/bladeburner.txt").split('\n')
		//ns.tprint(log[log.length-2])
		if (newAction != "") {
			if (log.length > 2) {
				if (!log[log.length - 2].includes(newAction))
					await ns.write("/logs/bladeburner.txt", ns.tFormat(ns.getTimeSinceLastAug()) + ' ' + newAction + '\n', 'a')
			} else
				await ns.write("/logs/bladeburner.txt", ns.tFormat(ns.getTimeSinceLastAug()) + ' ' + newAction + '\n', 'a')
		}
	}


	async function setContracts(analyze) {
		let count;
		for (let i = actions.contracts.length - 1; i >= 0; i--) {
			if (!analyze || (analyze && actions.contracts[i] == "Tracking"))
				count = await setAction("Contract", actions.contracts[i], 0.75)
			if (count > 0)
				return true;
		}
		return false
	}

	async function setOperations(analyze) {
		let count;
		for (let i = actions.operations.length - 1; i >= 0; i--) {
			if (!analyze || (analyze && (actions.operations[i] == "Investigation" || actions.operations[i] == "Undercover Operation")))
				count = await setAction("Operation", actions.operations[i], 0.9)
			if (count > 0)
				return true;
		}
		return false
	}

	async function setBlackOps() {
		let rankLevel = ns.read("/bladeburner/blackOpsRanks.txt")
		if (rankLevel == "") {
			await runSafeScript(ns, "/bladeburner/getBlackOpsRanks.js")
			rankLevel = ns.read("/bladeburner/blackOpsRanks.txt")
		}
		rankLevel = rankLevel.split(',')
		await runSafeScript(ns, "/bladeburner/getRank.js")
		let rank = parseInt(ns.read("/bladeburner/rank.txt"))
		let done = ns.read("/bladeburner/doneBlackOps.txt")
		for (let i = 0; i < actions.blackOps.length; i++) {
			if (rankLevel[i] < rank && !done.includes(actions.blackOps[i])) {
				await runScript(ns, "/bladeburner/successChance/get.js", "BlackOps", actions.blackOps[i])
				await setAction("BlackOps", actions.blackOps[i], 1)
			}
		}
	}

	async function setAction(type, name, chance) {
		let run = true; let count = 1;
		if (type != "General") {
			let perc = ns.read("/bladeburner/successChance/" + name.replaceAll(' ', '') + ".txt")
			if (type != "BlackOps") {
				await runSafeScript(ns, "/bladeburner/remaining/get.js", type, name)
				count = parseInt(ns.read("/bladeburner/remaining/" + name.replaceAll(' ', '') + ".txt"))
			}
			if (perc.includes(',')) {
				perc = perc.split(',')
				perc = (parseFloat(perc[0]) + parseFloat(perc[1])) / 2
			} else
				perc = parseFloat(perc)
			ns.print(parseInt(perc * 100) + '% ' + count + ' - ' + type + ':' + name)
			run = perc >= chance && count > 0
		}
		if (run) {
			if (action.name != name) {
				await runSafeScript(ns, "/bladeburner/startAction.js", type, name)
				newAction = type + ': ' + name
			}
		}
		return count
	}

	async function getChances(type) {
		let loop; let difference = false;
		switch (type) {
			case "Contract":
				loop = actions.contracts;
				break;
			case "Operation":
				loop = actions.operations;
				break;
		}
		for (let i in loop) {
			let file = ns.read("/bladeburner/successChance/" + loop[i].replaceAll(' ', '') + ".txt")
			if (file.includes(',')) {
				file = file.split(',')
				if (file[0] != file[1])
					difference = true
			}
			await runScript(ns, "/bladeburner/successChance/get.js", type, loop[i])
		}
		return difference
	}

	async function setSkill() {
		await runSafeScript(ns, "/bladeburner/skill/getPoints.js")
		let sP = parseInt(ns.read("/bladeburner/skill/points.txt"))
		let sC = JSON.parse(ns.read("/bladeburner/skill/cost.txt"))
		let sL = JSON.parse(ns.read("/bladeburner/skill/level.txt"))
		//ns.tprint(sP)
		//ns.tprint(sC)
		if (sC[11] < sP)
			return await runScript(ns, "/bladeburner/skill/upgrade.js", "Hyperdrive")
		if (sC[5] < sP && sL[5] < 90)
			return await runScript(ns, "/bladeburner/skill/upgrade.js", "Overclock")
		if (sC[0] < sP)
			return await runScript(ns, "/bladeburner/skill/upgrade.js", "Blade's Intuition")
		if (sC[6] < sP)
			return await runScript(ns, "/bladeburner/skill/upgrade.js", "Reaper")
		if (sC[7] < sP)
			return await runScript(ns, "/bladeburner/skill/upgrade.js", "Evasive System")
		if (action.type == "Contract") {
			if (sC[4] < sP /*&& sL[4] < 25*/)
				return await runScript(ns, "/bladeburner/skill/upgrade.js", "Tracer")
			if (sC[10] < sP)
				return await runScript(ns, "/bladeburner/skill/upgrade.js", "Hands of Midas")
		}
		if (sC[3] < sP)
			return await runScript(ns, "/bladeburner/skill/upgrade.js", "Digital Observer")
		if (sC[2] < sP /*&& sL[2] < 25*/)
			return await runScript(ns, "/bladeburner/skill/upgrade.js", "Short-Circuit")
		if (sC[1] < sP /*&& sL[1] < 25*/)
			return await runScript(ns, "/bladeburner/skill/upgrade.js", "Cloak")
		/*if (sC[8] < sP)
			return await runScript(ns, "/bladeburner/skill/upgrade.js", "Datamancer")*/
		return -1
	}
}