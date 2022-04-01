/** @param {NS} ns **/
export async function main(ns) {
	await ns.write("/stock/"+ns.args[0]+"/forecast.txt",ns.stock.getForecast(ns.args[0]),'w')
}