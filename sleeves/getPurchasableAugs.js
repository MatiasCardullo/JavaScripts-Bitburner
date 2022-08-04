/** @param {NS} ns */
export async function main(ns) {
	let count = parseInt(ns.read("/sleeves/count.txt"))
	for (let s = 0; s < count; s++)
		await ns.write("/sleeves/" + s + "/augsToBuy.txt", JSON.stringify(ns.sleeve.getSleevePurchasableAugs(s), null, '\t'),'w')
}