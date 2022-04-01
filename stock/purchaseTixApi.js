/** @param {NS} ns */
export async function main(ns) {
	try{
		await ns.write("/stock/access.txt",','+ns.stock.purchaseTixApi(),"a")
	}catch{
		await ns.write("/stock/access.txt",",false","a")
	}
}