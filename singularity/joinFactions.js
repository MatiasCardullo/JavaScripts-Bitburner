import { runSafeScript } from "./lib/basicLib.js";
import { speak } from "./lib/voice.js";

/** @param {NS} ns **/
export async function main(ns) {
	let zones = ["Chongqing", "Sector-12", "Aevum", "New Tokyo", "Ishima", "Volhaven"]
	await runSafeScript(ns,"/singularity/checkFactionInvitations.js")
	let invites = ns.read("/logs/invitations.txt").split(',')
	let ownAugments = ns.read("/logs/installedAugments.txt").split(',')
	let pathFactionAugments; let augments;
	let join;
	for (let h = 0; h < zones.length; h++) {
		pathFactionAugments = "/factions/" + zones[h].replaceAll(' ', '') + "/augments.txt"
		if (ns.read(pathFactionAugments)=="") {
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
			if (ns.getPlayer().city !== zones[h])
				ns.travelToCity(zones[h])
			if(ns.joinFaction(zones[h]))
				speak("Joined "+zones[h],11)
			break;
		}
	}
	for (let h = 0; h < invites.length; h++) {
		//ns.print(invites[h])
		if (invites[h]!=""&&!zones.includes(invites[h])) {
			if(invites[h]=="Illuminati"){
				ns.stopAction()
			}
			if(ns.joinFaction(invites[h]))
				speak("Joined "+invites[h],11)
		}

	}
}