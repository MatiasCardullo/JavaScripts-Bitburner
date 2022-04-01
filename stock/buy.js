/** @param {NS} ns **/
export async function main(ns) {
	ns.stock.buy(ns.args[0], ns.args[1]);
}