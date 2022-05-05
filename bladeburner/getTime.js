/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/bladeburner/actionTime.txt", ns.bladeburner.getActionTime(ns.args[0], ns.args[1]), 'w')
}