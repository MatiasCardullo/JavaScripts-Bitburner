/** @param {NS} ns **/
export async function main(ns) {
	if (ns.args[0] != null && ns.args[1] != null) {
		let array = ns.ls("home", ".js")
		for (let i = 0; i < array.length; i++) {
			let aux = ns.read(array[i])
			if (aux.includes(ns.args[0])) {
				await ns.prompt("  replace:\n  " + ns.args[0] + "\n  to:\n" + ns.args[1])
				aux = aux.replaceAll(ns.args[0], ns.args[1])
				await ns.write(array[i], aux, 'w')
			}
		}

	}
}