/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/bladeburner/level/" + ns.args[1].replaceAll(' ', '') + ".txt", ns.bladeburner.getActionCurrentLevel(ns.args[0], ns.args[1]), 'w')
}