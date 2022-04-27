/** @param {NS} ns */
export async function main(ns) {
	let list = ns.ls("home", ".js")
	await ns.write("scripts.txt",list.toString().replaceAll(',','\n'),'w')
}