/** @param {NS} ns **/
export async function main(ns) {
	if (ns.gang.purchaseEquipment(ns.args[0], ns.args[1])) {
		let file = ns.read("/gang/members/" + ns.args[0])
		if (file == "") {
			await ns.write("/gang/members/" + ns.args[0], ns.args[1], "w")
		} else {
			await ns.write("/gang/members/" + ns.args[0], ',' + ns.args[1], "a")
		}
	}
}