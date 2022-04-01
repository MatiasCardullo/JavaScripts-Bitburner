/** @param {NS} ns **/
export async function main(ns) {
	await ns.write("/stock/symbols.txt",ns.stock.getSymbols(),'w')
}