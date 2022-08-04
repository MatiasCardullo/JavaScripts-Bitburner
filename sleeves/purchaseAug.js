/** @param {NS} ns */
export async function main(ns) {
	if (ns.sleeve.purchaseSleeveAug(ns.args[0], ns.args[1]))
		ns.toast("Purchased " + ns.args[1] + " to Sleeve" + ns.args[0], 'success', 5000)
}