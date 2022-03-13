/** @param {NS} ns **/
export async function main(ns) {
	ns.run("killAll.js")
	await ns.sleep(1000)
	ns.kill("allLite.js","home",ns.args[0])
	ns.kill("displayServersLite.js","home",ns.args[1])
	ns.run("all.js",1,ns.args[0])
}