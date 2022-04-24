/** @param {NS} ns */
export async function main(ns) {
	ns.gang.ascendMember(ns.args[0])!==undefined?ns.tprint(ns.args[0]+" Ascended"):null
}