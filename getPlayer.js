/** @param {NS} ns **/
export async function main(ns) {
	await ns.write("/logs/playerStats.txt", JSON.stringify(ns.getPlayer(),null,'\t'), 'w')
}