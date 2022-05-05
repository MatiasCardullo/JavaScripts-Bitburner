/** @param {NS} ns */
export async function main(ns) {
	ns.bladeburner.setTeamSize(ns.args[0], ns.args[1], 1000000000000000000)
}