/** @param {NS} ns **/
export async function main(ns) {
	let log
	eval("log="+ns.args[0])
	ns.tprint(log)
}