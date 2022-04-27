/** @param {NS} ns */
export async function main(ns) {
	let output = []
	let array = JSON.parse(ns.read("/bladeburner/actions.txt")).skills
	array.forEach((s) => output.push(ns.bladeburner.getSkillUpgradeCost(s)))
	await ns.write("/bladeburner/skillCost.txt", JSON.stringify(output), 'w')
}