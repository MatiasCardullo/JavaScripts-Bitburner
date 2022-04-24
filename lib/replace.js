/** @param {NS} ns **/
export async function main(ns) {
	let server = [];
	if (ns.args[2] == null)
		server.push("home")
	else if (ns.args[2] == 'ALL') {
		let aux = ns.read("SERVERDATA.txt").split('\n')
		aux.shift()
		aux.forEach((s) => server.push(s.split(',')[0]))
	}
	else
		server.push(ns.args[2])
	for (let i in server) {
		let array = ns.ls(server[i], ".js")
		for (let i = 0; i < array.length; i++) {
			let aux = ns.read(array[i])
			if (aux.includes(ns.args[0]) && ns.args[1] != null) {
				aux = aux.replaceAll(ns.args[0], ns.args[1])
				await ns.write(array[i], aux, 'w')
			}
		}
	}
}