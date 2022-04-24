/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/gang/info.txt", JSON.stringify(ns.gang.getGangInformation(), null, '\t'), 'w')
}