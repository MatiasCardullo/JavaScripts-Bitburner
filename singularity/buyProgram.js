/** @param {NS} ns **/
export async function main(ns) {
	if(ns.purchaseProgram(ns.args[0]))
		ns.tprint(ns.args[0])
}