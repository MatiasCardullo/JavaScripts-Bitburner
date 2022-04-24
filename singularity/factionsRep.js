/** @param {NS} ns */
export async function main(ns) {
	let faction = ns.args[0];
	let path = "/factions/" + faction.replaceAll(' ', '').replace('&', 'And') + "/reputation.txt"
	await ns.write(path, ns.getFactionRep(faction), 'w')
}