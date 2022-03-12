/** @param {NS} ns **/
export async function main(ns) {
	ns.write("/singularity/RAMCost.txt",ns.getUpgradeHomeRamCost(),"w")
}