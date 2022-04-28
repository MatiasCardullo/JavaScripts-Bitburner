import { runSafeScript, runScript } from "./lib/basicLib.js";
import { speak } from "./sounds/voice.js";

/** @param {NS} ns */
export async function main(ns) {
	ns.tail()
	ns.disableLog('sleep')
	var actions = ns.read("/bladeburner/actions.txt")
	if (actions == "") {
		await runSafeScript(ns, "/bladeburner/getActions.js")
	}
	actions = JSON.parse(actions)
	//await runSafeScript(ns, "getPlayer.js")
	//let player = JSON.parse(ns.read("/logs/playerStats.txt"))
	let cities = ["Sector-12", "Aevum", "Volhaven", "Chongqing", "New Tokyo", "Ishima"];
	await runSafeScript(ns, "/bladeburner/getStamina.js")
	let stamina = parseFloat(ns.read("/bladeburner/stamina.txt"))
	let maxStamina = parseFloat(ns.read("/bladeburner/maxStamina.txt"))
	await runSafeScript(ns, "/bladeburner/getCurrentAction.js")
	let action = JSON.parse(ns.read("/bladeburner/currentAction.txt"))
	var difference = false
	//ns.tprint(maxStamina == stamina, !actions.contracts.includes(action.name))
	if (!actions.blackOps.includes(action.name)) {
		if (maxStamina < 50) {
			if (!ns.isRunning("/singularity/crime.js", "home", false, false))
				await runSafeScript(ns, "/singularity/crime.js", false, false);
		} else if (stamina < maxStamina / 10 /*|| player.hp < player.max_hp / 3*/) {
			if (action.name != "Hyperbolic Regeneration Chamber")
				await runSafeScript(ns, "/bladeburner/startAction.js", "General", "Hyperbolic Regeneration Chamber")
		} else {
			if (maxStamina == stamina /*&& player.hp == player.max_hp */ && !actions.contracts.includes(action.name) && !actions.operations.includes(action.name)) {
				await runSafeScript(ns, "/bladeburner/getCity.js")
				let city = ns.read("/bladeburner/currentCity.txt")
				await runSafeScript(ns, "/bladeburner/getCityChaos.js", city)
				if (difference && 50 < parseFloat(ns.read("/bladeburner/city/" + city + "/chaos.txt"))) {
					if (action.name != "Diplomacy")
						await runSafeScript(ns, "/bladeburner/startAction.js", "General", "Diplomacy")
				} else {
					let op; let c;
					op = await setOperations()
					ns.print(op)
					if (!op) {
						c = await setContracts()
						ns.print(c)
						if (!c && action.name != "Incite Violence")
							await runSafeScript(ns, "/bladeburner/startAction.js", "General", "Incite Violence")
					}
				}
			}
			if (difference && action.name != "Field Analysis") {
				await runSafeScript(ns, "/bladeburner/startAction.js", "General", "Field Analysis")
				difference = false
			}
			await setSkill()
			await setBlackOps()
		}
	}

	async function setContracts() {
		let count; let enough = false;
		for (let i = actions.contracts.length - 1; i >= 0; i--) {
			count = await setAction("Contract", actions.contracts[i])
			if (count === true)
				return true;
			else if (count > 0)
				enough = true;
		}
		return enough
	}

	async function setOperations() {
		let count; let enough = false;
		for (let i = actions.operations.length - 1; i >= 0; i--) {
			count = await setAction("Operation", actions.operations[i])
			if (count === true)
				return true;
			else if (count > 0)
				enough = true;
		}
		return enough
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
		ns.print(done.split(',').length + '/' + actions.blackOps.length)
		for (let i = 0; i < actions.blackOps.length; i++) {
			if (!done.includes(actions.blackOps[i]) && rankLevel[i] < rank) {
				await setAction("BlackOps", actions.blackOps[i])
				done = done.split(',')
				done.push(actions.blackOps[i])
				let text = "Bladeburner: Executing " + actions.blackOps[i] + ' ' + done.length
				speak(text + " of " + actions.blackOps.length, 11)
				ns.toast(text + '/' + actions.blackOps.length, "success", null)
				await ns.write("/bladeburner/doneBlackOps.txt", done, 'w')
				break;
			}
		}
	}

	async function setAction(type, name) {
		await runSafeScript(ns, "/bladeburner/getSuccessChance.js", type, name)
		await runSafeScript(ns, "/bladeburner/getRemaining.js", type, name)
		let count = parseInt(ns.read("/bladeburner/remaining/" + name.replaceAll(' ', '') + ".txt"))
		let perc = ns.read("/bladeburner/successChance/" + name.replaceAll(' ', '') + ".txt")
		ns.print(perc * 100 + '% ' + count + ' - ' + type + ':' + name)
		if (perc.includes(',')) {
			difference = true;
			perc = perc.split(',')
			perc = (parseFloat(perc[0]) + parseFloat(perc[1])) / 2
		} else
			perc = parseFloat(perc)
		if (perc > 0.9 && count > 0) {
			if (action.name != name)
				await runSafeScript(ns, "/bladeburner/startAction.js", type, name)
			return true
		}
		return count
	}

	async function setSkill() {
		await runSafeScript(ns, "/bladeburner/getSkillPoints.js")
		await runSafeScript(ns, "/bladeburner/getSkillCost.js")
		await runSafeScript(ns, "/bladeburner/getSkillLevel.js")
		let sP = parseInt(ns.read("/bladeburner/skillPoints.txt"))
		let sC = JSON.parse(ns.read("/bladeburner/skillCost.txt"))
		let sL = JSON.parse(ns.read("/bladeburner/skillCost.txt"))
		//ns.tprint(sP)
		//ns.tprint(sC)
		if (sC[0] < sP)
			return await runSafeScript(ns, "/bladeburner/upgradeSkill.js", "Blade's Intuition")
		if (sC[6] < sP)
			return await runSafeScript(ns, "/bladeburner/upgradeSkill.js", "Reaper")
		if (sC[7] < sP)
			return await runSafeScript(ns, "/bladeburner/upgradeSkill.js", "Evasive System")
		if (action.type == "Contract") {
			if (sC[4] < sP)
				return await runSafeScript(ns, "/bladeburner/upgradeSkill.js", "Tracer")
		}
		if (sC[3] < sP)
			return await runSafeScript(ns, "/bladeburner/upgradeSkill.js", "Digital Observer")
		if (sC[1] < sP && sL[1] < 25)
			return await runSafeScript(ns, "/bladeburner/upgradeSkill.js", "Cloak")
		if (sC[2] < sP && sL[1] < 25)
			return await runSafeScript(ns, "/bladeburner/upgradeSkill.js", "Short-Circuit")
		if (sC[11] < sP)
			return await runSafeScript(ns, "/bladeburner/upgradeSkill.js", "Hyperdrive")
		if (sC[5] < sP)
			return await runSafeScript(ns, "/bladeburner/upgradeSkill.js", "Overclock")
		if (sC[8] * 5 < sP)
			return await runSafeScript(ns, "/bladeburner/upgradeSkill.js", "Datamancer")
	}
}