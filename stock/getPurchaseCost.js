/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/stock/" + ns.args[0] + "/buyCost.txt",ns.stock.getPurchaseCost(ns.args[0], ns.args[1],ns.args[2]),'w')
}