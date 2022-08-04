/** @param {NS} ns **/
export async function main(ns) {
	await ns.write("/logs/bitnodeMultipliers.txt", JSON.stringify(ns.getBitNodeMultipliers(), null, '\t'), 'w')
}