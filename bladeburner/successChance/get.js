/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/bladeburner/successChance/" + ns.args[1].replaceAll(' ', '') + ".txt",
		ns.bladeburner.getActionEstimatedSuccessChance(ns.args[0], ns.args[1]), 'w')
}