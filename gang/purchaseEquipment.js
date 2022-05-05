/** @param {NS} ns **/
export async function main(ns) {
	if (ns.gang.purchaseEquipment(ns.args[0], ns.args[1])) {
		ns.toast("Gang: Purchased " + ns.args[1] + " to " + ns.args[0],"success")
	}
}