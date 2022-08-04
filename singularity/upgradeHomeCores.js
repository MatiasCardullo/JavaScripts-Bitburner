/** @param {NS} ns **/
export async function main(ns) {
	if (ns.singularity.upgradeHomeCores())
		ns.toast("Home Cores upgraded", "success", 30000)
}