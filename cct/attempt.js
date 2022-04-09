/** @param {NS} ns */
export async function main(ns) {
	let name = ns.args[1].slice(0, ns.args[1].length - 4).replace('&', 'And')
	let answer = ns.args[0]
	if (typeof (answer) == "string" && answer.includes(',')) {
		answer = ns.args[0].split(',')
		let areNumbers = true;
		let aux = ns.args[0].split(',')
		for (let i = 0; i < aux.length; i++) {
			aux[i] = parseInt(aux[i])
			if (isNaN(aux[i])) {
				areNumbers = false
				break;
			}
		}
		if (areNumbers) {
			answer = aux;
		}
	} else {
		let aux = parseInt(ns.args[0])
		if (!isNaN(aux))
			answer = aux
	}
	await ns.write("/cct/" + name + "/attempt.txt", ns.codingcontract.attempt(answer, ns.args[1], ns.args[2]), 'w');
}