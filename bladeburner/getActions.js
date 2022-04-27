/** @param {NS} ns */
export async function main(ns) {
	let bladeburnerActions = {
		general: ns.bladeburner.getGeneralActionNames(),
		contracts: ns.bladeburner.getContractNames(),
		operations: ns.bladeburner.getOperationNames(),
		blackOps: ns.bladeburner.getBlackOpNames(),
		skills: ns.bladeburner.getSkillNames()
	}
	await ns.write("/bladeburner/actions.txt", JSON.stringify(bladeburnerActions), 'w')
}