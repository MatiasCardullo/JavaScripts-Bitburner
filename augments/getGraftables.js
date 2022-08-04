/** @param {NS} ns */
export async function main(ns) {
	let list = ns.grafting.getGraftableAugmentations()
	let keyNames = JSON.parse(ns.read("/augments/names.txt"))
	list.forEach(function (a) {
		let path = "/augments/data/" + keyNames[a] + ".txt";
		if (ns.read(path) == "") {
			let pid
			do {
				pid = ns.run("/augments/getStats.js", 1, a)
			} while (pid > 0)
		}
	})
	await ns.write("/augments/graftables.txt", list, 'w')
}