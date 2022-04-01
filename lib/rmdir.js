/** @param {NS} ns **/
export async function main(ns) {
	ns.ls("home",ns.args[0]).forEach((e)=>ns.rm(e))
}