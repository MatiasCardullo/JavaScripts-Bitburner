/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/bladeburner/skill/points.txt", ns.bladeburner.getSkillPoints(), 'w')
}