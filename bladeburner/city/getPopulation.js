/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/bladeburner/city/"+ns.args[0].replace(' ','')+"/population.txt",ns.bladeburner.getCityEstimatedPopulation(ns.args[0]),'w')
}