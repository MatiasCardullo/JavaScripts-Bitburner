/** @param {NS} ns **/
export async function main(ns) {
	if (ns.singularity.applyToCompany(ns.args[0], ns.args[1]))
		ns.toast("apllied to " + ns.args[0])
	/*else
		ns.toast("not apllied to " + ns.args[0], "error")*/
}