/** @param {NS} ns **/
export async function main(ns) {
	let player = ns.getPlayer()
	let playerStats = [player.strength, player.defense, player.dexterity, player.agility]
	while (playerStats[0] < 1200 && playerStats[1] < 1200 && playerStats[2] < 1200 && playerStats[3] < 1200) {
		let pStatsName = ["strength", "defense", "dexterity", "agility"]
		//ns.tprint(playerStats)
		let prom = (playerStats[0] + playerStats[1] + playerStats[2] + playerStats[3]) / 4
		for (let i = 0; i < playerStats.length; i++) {
			if (playerStats[i] < prom - prom / 10 && playerStats[i] < 1200) {
				let auxcity = player.city
				if (auxcity !== "Sector-12")
					ns.travelToCity("Sector-12")
				ns.gymWorkout('powerhouse gym', pStatsName[i], true)
			}
		}
	}
}