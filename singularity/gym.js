/** @param {NS} ns **/
export async function main(ns) {
	let player = ns.getPlayer()
	while (player.strength < 1200 || player.defense < 1200 || player.dexterity < 1200 || player.agility < 1200) {
		let playerStats = [player.strength, player.defense, player.dexterity, player.agility]
		let pStatsName = ["strength", "defense", "dexterity", "agility"]
		//ns.tprint(playerStats)
		for (let i = 0; i < playerStats.length; i++) {
			if (playerStats[i] < 1200) {
				let auxcity = player.city
				if (auxcity !== "Sector-12")
					ns.travelToCity("Sector-12")
				ns.gymWorkout('powerhouse gym', pStatsName[i], false)
				/*else if(player.workType)
					ns.stopAction()*/
			}
		}
		await ns.sleep(0)
	}
}