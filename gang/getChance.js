/** @param {NS} ns **/
export async function main(ns) {
	let myGang = JSON.parse(ns.read("/gang/info.txt")).faction
	let gangs = JSON.parse(ns.read("/gang/otherGangs.txt"))
	let totalChance = 0
	let chance = 0;
	let count=0
	for (let g in gangs) {
		if (myGang != g) {
			count++
			chance = ns.gang.getChanceToWinClash(g);
			totalChance += chance;
			gangs[g].chance = chance;
		}
	}
	await ns.write("/gang/totalChanceToWinClash.txt", totalChance / count, 'w')
	await ns.write("/gang/otherGangs.txt", JSON.stringify(gangs), 'w')
}