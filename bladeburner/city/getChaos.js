/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/bladeburner/city/"+ns.args[0].replace(' ','')+"/chaos.txt",ns.bladeburner.getCityChaos(ns.args[0]),'w')
}