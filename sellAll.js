/** @param {NS} ns **/
export async function main(ns) {
	ns.kill("/stock/market.js","home")
	let stocks = ns.stock.getSymbols()
	for (let i = 0; i < stocks.length; i++){
    	ns.stock.sell(stocks[i],1000000000000000000)
	}
}