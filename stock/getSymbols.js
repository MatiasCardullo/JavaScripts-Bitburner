/** @param {NS} ns **/
export async function main(ns) {
	try {
		await ns.write("/stock/symbols.txt", ns.stock.getSymbols(), 'w')
	} catch { }
}