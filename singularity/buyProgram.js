/** @param {NS} ns **/
export async function main(ns) {
	if(ns.purchaseProgram(ns.args[0]))
		ns.toast(`Purchased program ${ns.args[0]}`,"success",15000)
}