/** @param {NS} ns **/
export async function main(ns) {
	ns.stock.sell(ns.args[0], ns.args[1]);
}