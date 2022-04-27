/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/bladeburner/"+ns.args[0]+"/population.txt",ns.bladeburner.getCityEstimatedPopulation(ns.args[0]),'w')
}