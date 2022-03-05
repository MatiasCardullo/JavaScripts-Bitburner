/** @param {NS} ns **/
export async function main(ns) {
	//ns.tail()
	let rep=[];
	let crime=[];
	let hak=[];
	let other=[];
	var ownAugments = ns.getOwnedAugmentations(true)
	let factions = ns.getPlayer().factions
	for (let h = 0; h < factions.length; h++) {
		let augments = ns.getAugmentationsFromFaction(factions[h]);
		for (let i = 0; i < augments.length; i++) {
			if (ownAugments.indexOf(augments[i]) === -1 && augments[i] !== "NeuroFlux Governor") {
				let data = ns.getAugmentationStats(augments[i])
				for (var key in data) {
					if (key.indexOf("rep") !== -1) {
						rep.push([factions[h],augments[i]])
					}else if (key.indexOf("crime") !== -1) {
						crime.push([factions[h],augments[i]])
					}else if (key.indexOf("hack") !== -1) {
						hak.push([factions[h],augments[i]])
					}else{
						other.push([factions[h],augments[i]])
					}
				}
			}
		}
	}
	if(rep.length+crime.length+hak.length>0){
		await buyLoop(rep);
		await buyLoop(crime);
		await buyLoop(hak);
	}else
		await buyLoop(other);

	if(ownAugments.length-ns.getOwnedAugmentations(false).length>=5){
		ns.installAugmentations("singularity/startup.js")
	}

	async function buyLoop(array){
		if(array.length>0){
			for (let i = 0; i < array.length; i++) {
				if(ns.getAugmentationPrice(array[i][1])<ns.getPlayer().money){
					ns.kill("singularity/crime.js","home",true)
					ns.kill("singularity/crime.js","home",false)
					if(ns.getFactionRep(array[i][0])<ns.getAugmentationRepReq(array[i][1])){
						while(ns.getFactionFavor(array[i][0])>=150&&ns.getAugmentationPrice(array[i][1])+1000<ns.getPlayer().money){
							await ns.sleep(0)
							ns.donateToFaction(array[i][0],1000)
						}
						if(ns.getPlayer().workType!=="Working for Faction"){
							if(!ns.workForFaction(array[i][0],"Security Work")){
								if(!ns.workForFaction(array[i][0],"Field Work")){
									ns.workForFaction(array[i][0],"Hacking Contracts")
								}
							}
						}else if(ns.getPlayer().currentWorkFactionName==array[i][0]){
							if(ns.getFactionRep(array[i][0])+ns.getPlayer().workRepGained>=ns.getAugmentationRepReq(array[i][1])){
								ns.stopAction()
							}
						}
					}
					ns.purchaseAugmentation(array[i][0], array[i][1])

				}
			}
		}
	}
}