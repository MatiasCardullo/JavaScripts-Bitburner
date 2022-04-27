/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/bladeburner/rank.txt", ns.bladeburner.getRank(), 'w')
}