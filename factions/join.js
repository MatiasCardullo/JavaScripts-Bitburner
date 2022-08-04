import { runSafeScript } from "./lib/basicLib.js";
import { speak } from "./sounds/voice.js";

/** @param {NS} ns **/
export async function main(ns) {
	let player = JSON.parse(ns.read("/logs/playerStats.txt"))
	let city = ["Chongqing", "Ishima", "New Tokyo", "Volhaven", "Sector-12", "Aevum"]
	let zones = [["Sector-12", "Aevum"], ["Chongqing", "Ishima", "New Tokyo"], ["Volhaven"]]
	let invites = ns.read("/factions/invitations.txt").split(',')
	let ownAugments = ns.read("/augments/installed.txt").split(',')
	let pathFactionAugments; let augments;
	let join;
	for (let g = 0; g < zones.length; g++) {
		for (let h = 0; h < zones[g].length; h++) {
			if (!player.factions.includes(zones[g][h])) {
				pathFactionAugments = "/factions/" + zones[g][h].replaceAll(' ', '') + "/augments.txt"
				if (ns.read(pathFactionAugments) == "")
					await runSafeScript(ns, "/factions/getAugments.js", zones[g][h])
				augments = ns.read(pathFactionAugments).split(',')
				join = false;
				for (let i = 0; i < augments.length; i++) {
					if (!ownAugments.includes(augments[i])) {
						join = true; break;
					}
				}
			}
			if (join) {
				if (player.city != zones[g][h]) {
					await runSafeScript(ns, "/singularity/travelToCity.js", zones[g][h])
				}
				if (ns.singularity.joinFaction(zones[g][h])) {
					speak("Joineed " + zones[g][h], 11)
					ns.toast("Joined " + zones[g][h], "success", 10000)
				}
				break;
			}
		}
		if (join)
			break;
	}
	for (let h = 0; h < invites.length; h++) {
		//ns.print(invites[h])
		if (invites[h] != "" && !city.includes(invites[h])) {
			if (ns.singularity.joinFaction(invites[h])) {
				speak("Joineed " + invites[h], 11)
				ns.toast("Joined " + invites[h], "success", 10000)
			}
		}

	}
}