/** @param {NS} ns */
export async function main(ns) {
	try {
		if (ns.sleeve.setToCompanyWork(ns.args[0], ns.args[1]))
			ns.toast("Sleeve_" + ns.args[0] + " working at " + ns.args[1], "success", 10000)
	} catch { }
}