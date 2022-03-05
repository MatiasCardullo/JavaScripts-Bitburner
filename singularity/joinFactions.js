/** @param {NS} ns **/
export async function main(ns) {
	let zones =["Sector-12","Aevum","Chongqing","New Tokyo","Ishima","Volhaven"]
	let invites=ns.checkFactionInvitations()
	let ownAugments=ns.getOwnedAugmentations()
	for (let h = 0; h < invites.length; h++) {
		//ns.print(invites[h])
		if(zones.indexOf(invites[h])!==-1){
			let augments = ns.getAugmentationsFromFaction(invites[h])
			let skip=true;
			for (let i = 0; i < augments.length; i++){
				if (ownAugments.indexOf(augments[i]) === -1) {
					skip=false;break;
				}
			}
			if(skip){
				continue;
			}
		}
		ns.joinFaction(invites[h]);
	}
}