/** @param {NS} ns **/
export async function main(ns) {
	await ns.write("/logs/RAMCost.txt",ns.singularity.getUpgradeHomeRamCost(),"w")
}