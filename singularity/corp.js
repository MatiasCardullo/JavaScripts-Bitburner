/** @param {NS} ns **/
export async function main(ns) {
	const AGRI_NAME="MCGREGOR"
	let cityList = ["Aevum", "Sector-12", "Chongqing", "Ishima", "New Tokyo", "Volhaven"];
	let nsc=ns.corporation;
	while(true){
		await ns.sleep(0)
		if(!ns.getPlayer().hasCorporation ){
			//Create corporation if it does not exist
			nsc.createCorporation("Nexxus",true);
		}else if(nsc.getDivision(AGRI_NAME)!==null){
			//Create division if not exists
			nsc.expandIndustry("Agriculture", AGRI_NAME);
		}else if(!nsc.hasUnlockUpgrade("Smart Supply")){
			//Buy and activate Smart supply if we do not have it
			nsc.unlockUpgrade("Smart Supply");
			let cities = nsc.getDivision(AGRI_NAME).cities;
			for (const city of cities) {
				nsc.setSmartSupply(AGRI_NAME,city,true);
			}
		}else if(nsc.getDivision(AGRI_NAME).cities.lengt<cityList.length){
			//Expand everywhere
			for (const city of cityList) {
				nsc.expandCity(AGRI_NAME,city);
			}
		}
	}
}