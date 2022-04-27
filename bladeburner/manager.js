import { runSafeScript, runScript } from "./lib/basicLib.js";

/** @param {NS} ns */
export async function main(ns) {
	//ns.tail()
	let actions = ns.read("/bladeburner/actions.txt")
	if (actions == "") {
		await runSafeScript(ns, "/bladeburner/getActions.js")
	}
	actions = JSON.parse(actions)
	await runSafeScript(ns, "getPlayer.js")
	let player = JSON.parse(ns.read("/logs/playerStats.txt"))
	await runSafeScript(ns, "/bladeburner/getStamina.js")
	let stamina = parseFloat(ns.read("/bladeburner/stamina.txt"))
	let maxStamina = parseFloat(ns.read("/bladeburner/maxStamina.txt"))
	await runSafeScript(ns, "/bladeburner/getCurrentAction.js")
	let action = JSON.parse(ns.read("/bladeburner/currentAction.txt"))
	//ns.tprint(maxStamina == stamina, !actions.contracts.includes(action.name))
	if (maxStamina < 50) {
		if (action.name != "Training")
			await runSafeScript(ns, "/bladeburner/startAction.js", "General", "Training")
	} else if (player.hp < player.max_hp / 3) {
		if (action.name != "Hyperbolic Regeneration Chamber")
			await runSafeScript(ns, "/bladeburner/startAction.js", "General", "Hyperbolic Regeneration Chamber")
	} else {
		if (maxStamina == stamina && !actions.contracts.includes(action.name)) {
			await runSafeScript(ns, "/bladeburner/getCityChaos.js", "Sector-12")
			if (50 < parseInt(ns.read("/bladeburner/Sector-12/chaos.txt"))) {
				if (action.name != "Diplomacy")
					await runSafeScript(ns, "/bladeburner/startAction.js", "General", "Diplomacy")
			} else if (await setContract())
				await setSkill()
			else if (action.name != "Incite Violence")
				await runSafeScript(ns, "/bladeburner/startAction.js", "General", "Incite Violence")
		} else if (player.hp == player.max_hp && action.name != "Field Analysis")
			await runSafeScript(ns, "/bladeburner/startAction.js", "General", "Field Analysis")
	}

	async function setContract() {
		await runSafeScript(ns, "/bladeburner/getSuccessChance.js", "Contract", "Retirement")
		await runSafeScript(ns, "/bladeburner/getRemaining.js", "Contract", "Retirement")
		if (parseFloat(ns.read("/bladeburner/successChance/Retirement.txt")) > 0.75
			&& parseInt(ns.read("/bladeburner/remaining/Retirement.txt")) > 0) {
			await runSafeScript(ns, "/bladeburner/startAction.js", "Contract", "Retirement")
			return true
		}
		await runSafeScript(ns, "/bladeburner/getSuccessChance.js", "Contract", "Bounty Hunter")
		await runSafeScript(ns, "/bladeburner/getRemaining.js", "Contract", "Bounty Hunter")
		if (parseFloat(ns.read("/bladeburner/successChance/BountyHunter.txt")) > 0.75
			&& parseInt(ns.read("/bladeburner/remaining/BountyHunter.txt")) > 0) {
			await runSafeScript(ns, "/bladeburner/startAction.js", "Contract", "Bounty Hunter")
			return true
		}
		await runSafeScript(ns, "/bladeburner/getSuccessChance.js", "Contract", "Tracking")
		await runSafeScript(ns, "/bladeburner/getRemaining.js", "Contract", "Tracking")
		if (parseFloat(ns.read("/bladeburner/successChance/Tracking.txt")) > 0.75
			&& parseInt(ns.read("/bladeburner/remaining/Tracking.txt")) > 0) {
			await runSafeScript(ns, "/bladeburner/startAction.js", "Contract", "Tracking")
			return true
		}
		return false
	}

	async function setSkill() {
		await runSafeScript(ns, "/bladeburner/getSkillPoints.js")
		await runSafeScript(ns, "/bladeburner/getSkillCost.js")
		let sP = parseInt(ns.read("/bladeburner/skillPoints.txt"))
		let sC = JSON.parse(ns.read("/bladeburner/skillCost.txt"))
		if (sC[0] < sP)
			return await runSafeScript(ns, "/bladeburner/upgradeSkill.js", "Blade's Intuition")
		if (sC[6] < sP)
			return await runSafeScript(ns, "/bladeburner/upgradeSkill.js", "Reaper")
		if (sC[7] < sP)
			return await runSafeScript(ns, "/bladeburner/upgradeSkill.js", "Evasive System")
		if (action.type == "Contract") {
			if (sC[4] < sP)
				return await runSafeScript(ns, "/bladeburner/upgradeSkill.js", "Tracer")
		} else if (action.type == "Operations" || action.type == "BlackOps") {
			if (sC[3] < sP)
				return await runSafeScript(ns, "/bladeburner/upgradeSkill.js", "Digital Observer")
			if (sC[5] < sP)
				return await runSafeScript(ns, "/bladeburner/upgradeSkill.js", "Overclock")
		}
		if (sC[1] < sP)
			return await runSafeScript(ns, "/bladeburner/upgradeSkill.js", "Cloak")
		if (sC[2] < sP)
			return await runSafeScript(ns, "/bladeburner/upgradeSkill.js", "Short-Circuit")
		if (sC[11] < sP)
			return await runSafeScript(ns, "/bladeburner/upgradeSkill.js", "Hyperdrive")

	}
}