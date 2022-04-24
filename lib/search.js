/** @param {NS} ns **/
export async function main(ns) {
	let server = [];
	if (ns.args[1] == null)
		server.push("home")
	else if (ns.args[1] == 'ALL') {
		let aux = ns.read("SERVERDATA.txt").split('\n')
		aux.shift()
		aux.forEach((s) => server.push(s.split(',')[0]))
	}
	else
		server.push(ns.args[1])
	for (let i in server) {
		let array = ns.ls(server[i], ".txt").concat(ns.ls(server[i], ".js"))
		array.forEach(function (e) {
			let output = "";
			ns.args[1] == null ? null : output += server[i] + '/'
			output += e
			if (e.includes(ns.args[0]))
				ns.tprint(output)
			let aux = ns.read(e)
			if (aux.includes(ns.args[0])) {
				aux = aux.split('\n')
				for (let i = 0; i < aux.length; i++) {
					if (aux[i].includes(ns.args[0])) {
						output += '\n    line ' + (i + 1)
						if (aux[i].length < 250)
							output += ': ' + aux[i]
						else
							output += ' to long'
					}
				}
				ns.tprint(output)
			}
		})
	}
}