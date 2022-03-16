/** @param {NS} ns **/
export async function main(ns) {
	let zones = ["Chongqing","New Tokyo", "Ishima", "Sector-12", "Aevum", "Volhaven"]
	let invites = ns.checkFactionInvitations()
	let ownAugments = ns.getOwnedAugmentations()
	let pathFactionAugments;let augments;
	let aux;
	let skip=false;
	let join = false;
	for (let h = 0; h < zones.length; h++) {
		pathFactionAugments="/singularity/factions/"+zones[h].replaceAll(' ','')+"Augments.txt"
		if(!ns.fileExists(pathFactionAugments)){
			ns.run("/singularity/factionsAugments.js",1,zones[h])
			await ns.sleep(50);
		}
		augments = ns.read(pathFactionAugments).split(',')
		let join = false;
		for (let i = 0; i < augments.length; i++) {
			if (!ownAugments.includes(augments[i])) {
				join = true; break;
			}
		}
		if (join) {
			if(ns.getPlayer().city!==zones[h])
				ns.travelToCity(zones[h])
			ns.joinFaction(zones[h])
			break;
		}
	}
	for (let h = 0; h < invites.length; h++) {
		//ns.print(invites[h])
		if (!zones.includes(invites[h])) {
			ns.joinFaction(invites[h]);
		}
		
	}
}