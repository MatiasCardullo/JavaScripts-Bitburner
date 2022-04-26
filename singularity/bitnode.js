/** @param {NS} ns **/
export async function main(ns) {
	await ns.write("/logs/bitnodeMultipliers.txt",ns.getBitNodeMultipliers(),'w')
}