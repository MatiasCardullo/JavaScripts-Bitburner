/** @param {NS} ns **/
export async function main(ns) {
	let zones = ["Chongqing", "Sector-12", "Aevum", "New Tokyo", "Ishima", "Volhaven"]
	let invites = ns.checkFactionInvitations()
	let ownAugments = ns.getOwnedAugmentations()
	/*if (!ownAugments.includes("Neuroreceptor Management Implant") && player.city !== "Chongqing") {
		ns.travelToCity("Chongqing")
	}*/
	for (let h = 0; h < zones.length; h++) {
		let augments = ns.getAugmentationsFromFaction(zones[h])
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