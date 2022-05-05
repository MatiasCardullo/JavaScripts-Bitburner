/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/bladeburner/actionProgress.txt",ns.bladeburner.getActionCountRemaining(ns.args[0],ns.args[1]),'w')
}