/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/bladeburner/skillPoints.txt", ns.bladeburner.getSkillPoints(), 'w')
}