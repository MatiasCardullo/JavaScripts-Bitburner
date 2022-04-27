/** @param {NS} ns */
export async function main(ns) {
	await ns.wget("https://raw.githubusercontent.com/MatiasCardullo/JavaScripts-Bitburner/main/scripts.txt", "/logs/scripts.txt")
	let list = ns.read("/logs/scripts.txt").split('\n')
	let auxList = []
	for (let i in list) {
		list[i].startsWith('/') ? auxList[i] = list[i].slice(1) : auxList[i] = list[i]
		await ns.wget("https://raw.githubusercontent.com/MatiasCardullo/JavaScripts-Bitburner/main/" + auxList[i], list[i])
	}
}