import { runSafeScript} from "./lib/basicLib.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.kill("/stock/market.js", "home")
	let stocks = ns.stock.getSymbols()
	for (let i = 0; i < stocks.length; i++) {
		await runSafeScript(ns, "/stock/sell.js", stok, 1000000000000000000)
	}
}