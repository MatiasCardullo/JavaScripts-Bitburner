import { runSafeScript, runScript } from "./lib/basicLib.js";

/** @param {NS} ns */
export async function main(ns) {
	let file = ns.read("/augments/stanek/activeFragments.txt")
	if (file == "")
		await runSafeScript(ns, "/augments/stanek/activeFragments.js")
	file = JSON.parse(ns.read("/augments/stanek/activeFragments.txt"))
	let list = []
	for (let frag of file) {
		if (frag.id < 100)
			list.push(frag)
	}
	while (ns.args[0]) {
		let rand = Math.random()
		if (ns.getServerMaxRam("home") - ns.getServerUsedRam("home") > list.length * 2) {
			for (let frag of list) {
				await runScript(ns, "/augments/stanek/chargeFragment.js", frag.x, frag.y, rand)
			}
		}
		if (rand > 0.2)
			await ns.sleep(0)
	}
	let ram = Math.floor((ns.getServerMaxRam("home") - ns.getServerUsedRam("home")) / ((list.length + 1) * 2))
	ns.print(ram)
	if (ram > 0) {
		//ns.tail()
		for (let frag of list) {
			let pid
			do {
				pid = ns.run("/augments/stanek/chargeFragment.js", ram, frag.x, frag.y)
			} while (pid < 0)
		}
	}
}