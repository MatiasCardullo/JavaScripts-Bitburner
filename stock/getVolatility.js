/** @param {NS} ns **/
export async function main(ns) {
    await ns.write("/stock/"+ns.args[0]+"/volatility.txt",ns.stock.getVolatility(ns.args[0]))
}