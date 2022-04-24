/** @param {NS} ns */
export async function main(ns) {
	ns.ls("home",ns.args[0]).forEach((e)=>ns.mv("home",e,e.replace(ns.args[0],ns.args[1])))
}