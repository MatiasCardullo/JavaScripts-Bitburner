/** @param {NS} ns */
export async function main(ns) {
	if (ns.grafting.graftAugmentation(ns.args[0], ns.args[1]))
		await ns.write("/augments/grafting.txt", ns.args[0] + ',' + new Date().getTime(), 'w')
}