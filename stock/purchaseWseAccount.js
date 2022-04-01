/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/stock/access.txt",ns.stock.purchaseWseAccount(),"w")
}