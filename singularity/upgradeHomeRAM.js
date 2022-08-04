/** @param {NS} ns **/
export async function main(ns) {
	if (ns.singularity.upgradeHomeRam())
		ns.toast("Home RAM upgraded", "success", 30000)
}