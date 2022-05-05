/** @param {NS} ns */
export async function main(ns) {
	let output = []
	let array = JSON.parse(ns.read("/bladeburner/actions.txt")).skills
	array.forEach((s) => output.push(ns.bladeburner.getSkillLevel(s)))
	await ns.write("/bladeburner/skill/level.txt", JSON.stringify(output), 'w')
}