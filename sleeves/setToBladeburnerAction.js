/** @param {NS} ns */
export async function main(ns) {
	try {
		ns.sleeve.setToBladeburnerAction(ns.args[0], ns.args[1], ns.args[2])
	} catch { }
}