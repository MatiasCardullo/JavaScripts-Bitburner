/** @param {NS} ns **/
export async function main(ns) {
	ns.ls("home", ".txt").forEach((e) => e.includes(ns.args[0]) ? ns.tprint(e) : ns.read(e).includes(ns.args[0])?ns.tprint(e):null)
	ns.ls("home", ".js").forEach((e) => e.includes(ns.args[0]) ? ns.tprint(e) : ns.read(e).includes(ns.args[0])?ns.tprint(e):null)
}