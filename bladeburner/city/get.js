/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/bladeburner/city/current.txt",ns.bladeburner.getCity(),'w')
}