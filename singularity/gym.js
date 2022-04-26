/** @param {NS} ns **/
export async function main(ns) {
	let player;
	do {
		await runSafeScript(ns, "getPlayer.js")
		player = JSON.parse(ns.read("/logs/playerStats.txt"))
		let playerStats = [player.strength, player.defense, player.dexterity, player.agility]
		let pStatsName = ["strength", "defense", "dexterity", "agility"]
		//ns.tprint(playerStats)
		if (player.city !== "Sector-12")
			await runSafeScript(ns, "/singularity/travelToCity.js", "Sector-12")
		for (let i = 0; i < playerStats.length; i++) {
			if (playerStats[i] < 1200) {
				ns.singularity.stopAction()
				ns.singularity.gymWorkout('powerhouse gym', pStatsName[i], false)
				await ns.sleep(1000)
				/*else if(player.workType)
					ns.stopAction()*/
			}
		}
	} while (player.strength < 1200 || player.defense < 1200 || player.dexterity < 1200 || player.agility < 1200)
	ns.singularity.stopAction()
}