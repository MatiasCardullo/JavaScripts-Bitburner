/** @param {NS} ns */
export async function main(ns) {
	let a; let b;
	[a, b] = ns.bladeburner.getActionEstimatedSuccessChance(ns.args[0], ns.args[1])
	await ns.write("/bladeburner/successChance/" + ns.args[1].replaceAll(' ', '') + ".txt", (a + b) / 2, 'w')
}