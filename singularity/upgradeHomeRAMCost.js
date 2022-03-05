/** @param {NS} ns **/
export async function main(ns) {
	ns.write("RAMCost.txt",ns.getUpgradeHomeRamCost(),"w")
}