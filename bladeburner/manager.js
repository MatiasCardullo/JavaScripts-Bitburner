import { runSafeScript, runScript } from "./lib/basicLib.js";
import { speak } from "./sounds/voice.js";

/** @param {NS} ns */
export async function main(ns) {
	//ns.tail()
	ns.disableLog('sleep')
	let money = ns.args[0]
	let actions = ns.read("/bladeburner/actions.txt")
	if (actions == "") {
		await runSafeScript(ns, "/bladeburner/getActions.js")
		await runSafeScript(ns, "/bladeburner/skill/getCost.js")
		await runSafeScript(ns, "/bladeburner/skill/getLevel.js")
	}
	actions = JSON.parse(actions)
	let player = JSON.parse(ns.read("/logs/playerStats.txt"))
	if (stop()) {
		await runSafeScript(ns, "/singularity/stopAction.js")
	}
	let cities = ["Sector-12", "Aevum", "Volhaven", "Chongqing", "New Tokyo", "Ishima"];
	await runSafeScript(ns, "/bladeburner/getStamina.js")
	let stamina = parseFloat(ns.read("/bladeburner/stamina.txt"))
	let maxStamina = parseFloat(ns.read("/bladeburner/maxStamina.txt"))
	let rank = parseFloat(ns.read("/bladeburner/rank.txt"))
	await runSafeScript(ns, "/bladeburner/getRank.js")
	if (rank > parseFloat(ns.read("/bladeburner/rank.txt"))) {
		await runSafeScript(ns, "/bladeburner/stopAction.js")
		rank = parseFloat(ns.read("/bladeburner/rank.txt"))
	}
	await runSafeScript(ns, "/bladeburner/getCurrentAction.js")
	let action = JSON.parse(ns.read("/bladeburner/currentAction.txt"))
	let newAction = "";
	if (action.type == "BlackOp") {
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
		let chCon = await getChances("Contract")
		let chOp = await getChances("Operation")
		let chBOp = await getChances("BlackOps")
		await runSafeScript(ns, "/bladeburner/city/get.js")
		let city = ns.read("/bladeburner/city/current.txt")
		await runSafeScript(ns, "/bladeburner/city/getPopulation.js", city)
		let pop = parseInt(ns.read("/bladeburner/city/" + city.replace(' ', '') + "/population.txt"))
		let popDown = false;
		if (1400000000 > pop) {
			popDown = true;
		} /*else if (action.name == "Tracking" || action.name == "Investigation" || action.name == "Undercover Operation") {
			await runSafeScript(ns, "/bladeburner/stopAction.js")
		}*/
		if (1300000000 > pop && action.name != "Hyperbolic Regeneration Chamber" && action.name != "Tracking" && action.name != "Investigation" && action.name != "Undercover Operation") {
			await runSafeScript(ns, "/bladeburner/stopAction.js")
			let i = cities.indexOf(city)
			if (i == cities.length - 1)
				i = 0
			else
				i++
			city = cities[i]
			await runSafeScript(ns, "/bladeburner/city/switch.js", city)
		} else {
			await runSafeScript(ns, "/bladeburner/city/getChaos.js", city)
			let chaos = parseFloat(ns.read("/bladeburner/city/" + city.replace(' ', '') + "/chaos.txt"))
			if (50 < chaos && action.name != "Hyperbolic Regeneration Chamber") {
				await setAction("General", "Diplomacy")
				while (40 < parseFloat(ns.read("/bladeburner/city/" + city.replace(' ', '') + "/chaos.txt"))) {
					await runScript(ns, "/bladeburner/city/getChaos.js", city)
					await ns.sleep(59900)
					chaos = parseFloat(ns.read("/bladeburner/city/" + city.replace(' ', '') + "/chaos.txt"))
				}
			}
		}
		if (stamina < maxStamina * 2 / 5 || player.hp < player.max_hp / 3 || action.type == "Idle") {
			await setAction("General", "Hyperbolic Regeneration Chamber")
		} else {
			if (chCon || chOp || chBOp) {
				if (action.type != "Contract" && action.type != "Operation") {
					do {
						await setAction("General", "Field Analysis")
						await ns.sleep(6000)
						if (stop())
							ns.exit()
						chCon = await getChances("Contract")
						chOp = await getChances("Operation")
						chBOp = await getChances("BlackOps")
					} while (chCon || chOp || chBOp)
					await runSafeScript(ns, "/bladeburner/stopAction.js")
				}
			} else if (action.name == "Field Analysis") {
				await setAction("General", "Hyperbolic Regeneration Chamber")
			}
			if (maxStamina * 0.99 < stamina) {
				let op = false; let c;
				if (money != true && action.type != "Operation")
					op = await setOperations(popDown)
				if (action.type != "Contract" && action.type != "Operation") {
					c = await setContracts(popDown)
					if (action.type != "Contract" && action.type != "Operation" && player.max_hp == player.hp) {
						await setAction("General", "Training")
					}
				}
			} else if (maxStamina * 2 / 3 > stamina && action.name == "Training") {
				await setAction("General", "Hyperbolic Regeneration Chamber")
			}
			while (await setSkill() > 0) {
				await runSafeScript(ns, "/bladeburner/skill/getCost.js")
				await runSafeScript(ns, "/bladeburner/skill/getLevel.js")
			}
		}
		await setBlackOps(rank)
		let log = ns.read("/logs/bladeburner.txt").split('\n')
		//ns.tprint(log[log.length-2])
		if (newAction != "") {
			if (log.length > 2) {
				if (!log[log.length - 2].includes(newAction))
					await ns.write("/logs/bladeburner.txt", player.playtimeSinceLastBitnode + ' ' + newAction + '\n', 'a')
			} else
				await ns.write("/logs/bladeburner.txt", player.playtimeSinceLastBitnode + ' ' + newAction + '\n', 'a')
		}
	}

	async function setContracts(analyze) {
		let count;
		let out = false;
		for (let i = actions.contracts.length - 1; i >= 0; i--) {
			action = JSON.parse(ns.read("/bladeburner/currentAction.txt"))
			if (action.type != "Contract") {
				if (!analyze || (analyze && actions.contracts[i] == "Tracking"))
					count = await setAction("Contract", actions.contracts[i], 0.75)
				if (count > 0)
					out = true;
			}
		}
		return false
	}

	async function setOperations(analyze) {
		let count;
		let out = false;
		for (let i = actions.operations.length - 1; i >= 0; i--) {
			action = JSON.parse(ns.read("/bladeburner/currentAction.txt"))
			if (action.type != "Operation") {
				if (!analyze || (analyze && (actions.operations[i] == "Investigation" || actions.operations[i] == "Undercover Operation")))
					count = await setAction("Operation", actions.operations[i], 0.9)
				if (count > 0)
					out = true;
			}
		}
		return out
	}

	async function setBlackOps(rank) {
		let rankLevel = ns.read("/bladeburner/blackOpsRanks.txt")
		if (rankLevel == "") {
			await runSafeScript(ns, "/bladeburner/getBlackOpsRanks.js")
			rankLevel = ns.read("/bladeburner/blackOpsRanks.txt")
		}
		rankLevel = rankLevel.split(',')
		let done = ns.read("/bladeburner/doneBlackOps.txt")
		for (let i = 0; i < actions.blackOps.length; i++) {
			if (rankLevel[i] < rank) {
				await setAction("BlackOps", actions.blackOps[i], 0.99)
			}
		}
	}

	async function setAction(type, name, chance) {
		let run = true;
		let count = 1;
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
			run = perc > chance && count > 0
		}
		if (run) {
			await runSafeScript(ns, "/bladeburner/getCurrentAction.js")
			action = JSON.parse(ns.read("/bladeburner/currentAction.txt"))
			if (action.name != name) {
				await runSafeScript(ns, "/bladeburner/startAction.js", type, name)
				await runSafeScript(ns, "/bladeburner/getCurrentAction.js")
				action = JSON.parse(ns.read("/bladeburner/currentAction.txt"))
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
			case "BlackOps":
				loop = actions.blackOps;
				break;
		}
		for (let i in loop) {
			/*if (type == "BlackOps")
				await runSafeScript(ns, "/bladeburner/setTeamSize.js", type, loop[i])*/
			await runSafeScript(ns, "/bladeburner/successChance/get.js", type, loop[i])
			let file = ns.read("/bladeburner/successChance/" + loop[i].replaceAll(' ', '') + ".txt")
			if (file.includes(',')) {
				file = file.split(',')
				if (file[0] != file[1])
					difference = true
			}
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
		if (sC[11] < sP && sL[11] < 20)
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
			if (sC[4] < sP && sL[4] < 20)
				return await runScript(ns, "/bladeburner/skill/upgrade.js", "Tracer")
			if (/*money != false &&*/ sC[10] < sP)
				return await runScript(ns, "/bladeburner/skill/upgrade.js", "Hands of Midas")
		} else if (ns.read("/sleeves/count.txt") != "" && sC[10] < sP)
			return await runScript(ns, "/bladeburner/skill/upgrade.js", "Hands of Midas")
		if (sC[3] < sP)
			return await runScript(ns, "/bladeburner/skill/upgrade.js", "Digital Observer")
		if (sC[2] < sP)
			return await runScript(ns, "/bladeburner/skill/upgrade.js", "Short-Circuit")
		if (sC[1] < sP)
			return await runScript(ns, "/bladeburner/skill/upgrade.js", "Cloak")
		return -1
	}

	function stop() {
		let player = JSON.parse(ns.read("/logs/playerStats.txt"))
		return player.isWorking && !ns.read("/augments/installed.txt").includes("The Blade's Simulacrum")
	}
}