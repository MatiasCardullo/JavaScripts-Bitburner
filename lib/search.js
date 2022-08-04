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
		let output = "";
		array.forEach(function (e) {
			if (e.includes(ns.args[0])) {
				output += '\n'
				ns.args[1] == null ? null : output += server[i] + '/'
				output += e
			}
			let aux = ns.read(e)
			if (aux.includes(ns.args[0])) {
				output += '\n'
				ns.args[1] == null ? null : output += server[i] + '/'
				output += e
				aux = aux.split('\n')
				for (let i = 0; i < aux.length; i++) {
					if (aux[i].includes(ns.args[0])) {
						output += '\n    line ' + (i + 1)
						if (aux[i].length > 500)
							output += ' to long'
						else if (aux[i].length > 200)
							output += ':\n' + aux[i]
						else
							output += ': ' + aux[i]
					}
				}
			}
		})
		ns.tprint(output)
	}
}