import { runSafeScript, runScript } from "./lib/basicLib.js";

/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/logs/bladeburner.txt", "", 'w')
	await ns.write("/bladeburner/doneBlackOps.txt", "", 'w')
	await ns.write("mail.txt", "", 'w')
	runSafeScript(ns, "/augments/stanek/get.js")
	runSafeScript(ns, "/singularity/bitnodeData.js")
	runScript(ns, "autoStart.js")
}