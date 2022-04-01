/** @param {NS} ns **/
export async function main(ns) {
	await ns.write("/stock/"+ns.args[0]+"/price.txt",ns.stock.getAskPrice(ns.args[0]),'w')
}