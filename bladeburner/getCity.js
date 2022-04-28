/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/bladeburner/currentCity.txt",ns.bladeburner.getCity(),'w')
}