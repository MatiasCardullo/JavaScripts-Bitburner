/** @param {NS} ns */
export async function main(ns) {
	if (ns.args[0] != null && ns.args[1] != null) {
		await ns.wget(ns.args[0], ns.args[1])
		if (ns.args[2] != null && ns.args[3] != null) {
			let file = ns.read(ns.args[1])
			let start = file.indexOf(ns.args[2])
			let end = file.indexOf(ns.args[3], start)
			file = file.slice(start, end)
			if (ns.args[4] != null)
				file += ns.args[4]
			await ns.write(ns.args[1], file, 'w')
		}
	}
}