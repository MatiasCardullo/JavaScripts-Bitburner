/** @param {NS} ns **/
export async function main(ns) {
	ns.gang.setMemberTask(ns.args[0], ns.args[1])
}