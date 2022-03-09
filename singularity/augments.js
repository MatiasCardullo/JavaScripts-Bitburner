import { _beep2 } from "./sounds/beep2.js"
import { _chargeSound } from "./sounds/chargeSound.js"

/** @param {NS} ns **/
export async function main(ns) {
	//ns.tail()
	let count=3
	let rep=[];
	let crime=[];
	let hak=[];
	let augments;
	var ownAugments = ns.getOwnedAugmentations(true)
	let factions = ns.getPlayer().factions
	for (let h = 0; h < factions.length; h++) {
		augments = ns.getAugmentationsFromFaction(factions[h]);
		for (let i = 0; i < augments.length; i++) {
			if (ownAugments.indexOf(augments[i]) === -1 && augments[i] !== "NeuroFlux Governor") {
				let data = ns.getAugmentationStats(augments[i]);
				if(augments[i] == "The Red Pill"){
					await buyLoop([[factions[h],augments[i]]]);
				}
				for (var key in data) {
					if (key.indexOf("rep") !== -1) {
						rep.push([factions[h],augments[i]])
					}else if (key.indexOf("crime") !== -1) {
						crime.push([factions[h],augments[i]])
					}else if (key.indexOf("hack") !== -1) {
						hak.push([factions[h],augments[i]])
					}else{
						//other.push([factions[h],augments[i]])
					}
				}
			}
		}
	}
	
	if(rep.length+crime.length+hak.length>0){
		await buyLoop(rep);
		await buyLoop(hak);
		await buyLoop(crime);
	}//else
		//await buyLoop(other);

	let augs=ownAugments.length-ns.getOwnedAugmentations(false).length
	if(augs>=count){
		ns.kill("all.js","home",true)
		if(ns.kill("stockTest.js","home"))
			ns.exec("sellAll.js","home")
		
		for (let h = 0; h < factions.length; h++) {
			augments = ns.getAugmentationsFromFaction(factions[h]);
			for (let i = 0; i < augments.length; i++) {
				ns.purchaseAugmentation(factions[h], augments[i])
			}
		}
		
		for (let h = 0; h < factions.length; h++) 
			while(ns.purchaseAugmentation(factions[h], "NeuroFlux Governor")){}
	
		ns.stopAction()
		await ns.sleep(5000)	
		new Audio("data:audio/wav;base64,"+_chargeSound).play()
		ns.installAugmentations("autoStart.js")
	}

	async function buyLoop(array){
		for (let i = 0; i < array.length; i++) {
			if(ns.getAugmentationPrice(array[i][1])<ns.getPlayer().money&&array[i][1]!=="The Red Pill"){
				ns.kill("/singularity/crime.js","home",true)
				ns.kill("/singularity/crime.js","home",false)
			}/*else if(!ns.scriptRunning("/singularity/crime.js","home")){
				ns.exec("/singularity/crime.js","home",1,false)
			}*/
			if(ns.getFactionRep(array[i][0])<ns.getAugmentationRepReq(array[i][1])){
				if(ns.getFactionFavor(array[i][0])>=150&&ns.getAugmentationPrice(array[i][1])+1000<ns.getPlayer().money){
					ns.donateToFaction(array[i][0],ns.getPlayer().money-ns.getAugmentationPrice(array[i][1]))
				}
				if(ns.getPlayer().workType!=="Working for Faction"&ns.getPlayer().workType!=="Committing a crime"){
					if(!ns.workForFaction(array[i][0],"Security Work",true)){
						if(!ns.workForFaction(array[i][0],"Field Work",true)){
							ns.workForFaction(array[i][0],"Hacking Contracts",true)
						}
					}
				}else if(ns.getPlayer().currentWorkFactionName==array[i][0]){
					if(ns.getFactionRep(array[i][0])+ns.getPlayer().workRepGained>=ns.getAugmentationRepReq(array[i][1])){
						ns.stopAction()
					}
				}
			}
			if(ns.purchaseAugmentation(array[i][0], array[i][1])){
				new Audio("data:audio/wav;base64,"+_beep2).play()
			}
		}
	}
}