import { runSafeScript } from "./lib/basicLib.js";
import { speak } from "./sounds/voice.js";

/** @param {NS} ns **/
export async function main(ns) {
	let player = JSON.parse(ns.read("/logs/playerStats.txt"))
	let zones = ["Chongqing", "Sector-12", "Aevum", "New Tokyo", "Ishima", "Volhaven"]
	let invites = ns.read("/logs/invitations.txt").split(',')
	let ownAugments = ns.read("/logs/installedAugments.txt").split(',')
	let pathFactionAugments; let augments;
	let join;
	for (let h = 0; h < zones.length; h++) {
		pathFactionAugments = "/factions/" + zones[h].replaceAll(' ', '') + "/augments.txt"
		if (ns.read(pathFactionAugments) == "") {
			ns.run("/singularity/factionsAugments.js", 1, zones[h])
			await ns.sleep(50);
		}
		augments = ns.read(pathFactionAugments).split(',')
		join = false;
		for (let i = 0; i < augments.length; i++) {
			if (!ownAugments.includes(augments[i])) {
				join = true; break;
			}
		}
		if (join) {
			if (player.city !== zones[h])
				await runSafeScript(ns, "/singularity/travelToCity.js", zones[h])
			if (ns.singularity.joinFaction(zones[h])) {
				speak("Joineed " + zones[h], 11)
				ns.toast("Joined " + zones[h], "success", 10000)
			}
			break;
		}
	}
	for (let h = 0; h < invites.length; h++) {
		//ns.print(invites[h])
		if (invites[h] != "" && !zones.includes(invites[h])) {
			if (ns.singularity.joinFaction(invites[h])) {
				speak("Joineed " + invites[h], 11)
				ns.toast("Joined " + invites[h], "success", 10000)
			}
		}

	}
}