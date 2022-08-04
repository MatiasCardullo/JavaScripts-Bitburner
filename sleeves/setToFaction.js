/** @param {NS} ns */
export async function main(ns) {
	try {
		ns.sleeve.setToFactionWork(ns.args[0], ns.args[1], "Security") || ns.sleeve.setToFactionWork(ns.args[0], ns.args[1], "Field") || ns.sleeve.setToFactionWork(ns.args[0], ns.args[1], "Hacking") ?
			ns.toast("Sleeve_" + ns.args[0] + " working at " + ns.args[1], "success", 10000) : ns.toast("Sleeve_" + ns.args[0] + " fail to work at " + ns.args[1], "error", 10000)

	} catch { }
}