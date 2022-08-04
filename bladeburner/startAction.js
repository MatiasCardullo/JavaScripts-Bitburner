/** @param {NS} ns */
export async function main(ns) {
	if (ns.bladeburner.startAction(ns.args[0], ns.args[1])) {
		let action = { "type": ns.args[0], "name": ns.args[1] }
		await ns.write("/bladeburner/currentAction.txt", JSON.stringify(action), 'w')
	}
}