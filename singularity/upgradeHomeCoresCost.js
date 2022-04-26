/** @param {NS} ns **/
export async function main(ns) {
	await ns.write("/logs/coreCost.txt",ns.singularity.getUpgradeHomeCoresCost(),"w")
}