/** @param {NS} ns */
export async function main(ns) {
	let file = ns.args[0].split('/')
	file = file[file.length - 1]
	ns.scp(ns.args[0], 'home', 'n00dles')
	ns.mv('n00dles', file, '_' + file)
	ns.scp('_' + file, 'n00dles', 'home')
	ns.rm('_' + file, 'n00dles')
	ns.mv('home', '_' + file, ns.args[1])
}