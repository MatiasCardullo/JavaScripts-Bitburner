/** @param {NS} ns **/
export async function main(ns) {
	let gangs = JSON.parse(ns.read("/gang/otherGangs.txt"))
	let totalChance = 0
	let chance;
	for (let g in gangs) {
		chance = ns.gang.getChanceToWinClash(g);
		totalChance += chance;
		gangs[g].chance = chance;
	}
	await ns.write("/gang/totalChanceToWinClash.txt", totalChance / gangs.length, 'w')
	await ns.write("/gang/otherGangs.txt", JSON.stringify(gangs), 'w')
}