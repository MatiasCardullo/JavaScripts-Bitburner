/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/bladeburner/"+ns.args[0]+"/chaos.txt",ns.bladeburner.getCityChaos(ns.args[0]),'w')
}