/** @param {NS} ns **/
export async function main(ns) {
	ns.write("coreCost.txt",ns.getUpgradeHomeCoresCost(),"w")
}