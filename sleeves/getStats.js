/** @param {NS} ns */
export async function main(ns) {
	let count = parseInt(ns.read("/sleeves/count.txt"))
	for (let s = 0; s < count; s++)
		await ns.write("/sleeves/" + s + "/stats.txt", JSON.stringify(ns.sleeve.getSleeveStats(s), null, '\t'),'w')
}