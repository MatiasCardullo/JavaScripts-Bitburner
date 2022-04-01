/** @param {NS} ns **/
export async function main(ns) {
	await ns.write("/stock/"+ns.args[0]+"/maxShares.txt",ns.stock.getMaxShares(ns.args[0]),'w')
}