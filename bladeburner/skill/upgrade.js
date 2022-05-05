/** @param {NS} ns */
export async function main(ns) {
	if (ns.bladeburner.upgradeSkill(ns.args[0]))
		ns.toast("Skill upgrade: " + ns.args[0],"success",5000)
}