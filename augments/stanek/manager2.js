/** @param {NS} ns */
export async function main(ns) {
	let file = ns.read("/augments/stanek/activeFragments.txt")
	file = JSON.parse(ns.read("/augments/stanek/activeFragments.txt"))
	let list = [{ x: 2, y: 1 }, { x: 3, y: 6 }]
	let ram;
	while (true) {
		let used = ns.getServerUsedRam(ns.args[0]);
		if (used == 2.7) {
			ram = ((ns.getServerMaxRam(ns.args[0]) - used) / 2) / list.length
			for (let frag of list) {
				let pid = 0
				do {
					pid = ns.run("/augments/stanek/chargeFragment.js", ram, frag.x, frag.y)
				} while (pid < 0)
			}
		}
		else
			await ns.sleep(0)
	}
}