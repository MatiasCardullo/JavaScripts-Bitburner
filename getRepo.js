/** @param {NS} ns */
export async function main(ns) {
	let list = ns.ls("home", ".js")
	for (let i in list) {
		list[i].startsWith('/') ? list[i] = list[i].slice(1) : null
		ns.tprint("https://raw.githubusercontent.com/MatiasCardullo/JavaScripts-Bitburner/main/" + list[i]/*, f*/)
	}
}