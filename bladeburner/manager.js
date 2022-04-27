import { runSafeScript, runScript } from "./lib/basicLib.js";

/** @param {NS} ns */
export async function main(ns) {
	await ns.sleep(0)
	/*let actions=ns.read("/bladeburner/actions.txt")
	if(actions==""){
		await runSafeScript(ns,"/bladeburner/getActions.js")
	}
	ns.tprint(actions)
	actions=JSON.parse(actions)*/
	ns.exit()

	await runSafeScript(ns, "getPlayer.js")
	let player = JSON.parse(ns.read("/logs/playerStats.txt"))
}