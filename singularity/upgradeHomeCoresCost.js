/** @param {NS} ns **/
export async function main(ns) {
	ns.write("/singularity/coreCost.txt",ns.getUpgradeHomeCoresCost(),"w")
}