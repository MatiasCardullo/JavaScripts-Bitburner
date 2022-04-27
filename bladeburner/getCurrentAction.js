/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/bladeburner/currentAction.txt", JSON.stringify(ns.bladeburner.getCurrentAction()), 'w')
}