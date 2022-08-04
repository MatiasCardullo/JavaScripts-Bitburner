/** @param {NS} ns */
export async function main(ns) {
	//ns.tail()
	let player = JSON.parse(ns.read("/logs/playerStats.txt"))
	let count = 0;
	while (player.currentWorkFactionDescription == "carrying out hacking contracts" && count < 10) {
		await ns.share()
		player = JSON.parse(ns.read("/logs/playerStats.txt"))
		count++
	}
}