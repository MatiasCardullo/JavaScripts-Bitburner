/** @param {NS} ns **/
export async function main(ns) {
	ns.clearLog()
	let g = ns.gang;

	let gangs = g.getOtherGangInformation();
	//let output = "";
	let gangCount = 0;
	let totalChance = 0;
	for (var key in gangs) {
		gangCount++
		totalChance += g.getChanceToWinClash(key);
		//output += "\n" + key + ':';
		/*for (var key2 in gangs[key]) {
			output += "\n   " + key2 + ':' + gangs[key][key2];
		}*/
	}
	totalChance /= gangCount;
	g.setTerritoryWarfare(totalChance > 0.8)
	//ns.write("gangsInfo.txt", output, 'w')
	if (g.inGang) {
		g.recruitMember(Math.random() * 100000)
		let names = g.getMemberNames()
		let info = g.getGangInformation()
		let memberInfo;
		for (let h = 0; h < names.length; h++) {
			memberInfo = g.getMemberInformation(names[h])
			if (h / names.length > 3 / 5 || names.length < 4) {
				if (memberInfo.task !== "Territory Warfare") {
					g.setMemberTask(names[h], "Territory Warfare")
				}
			}
			else {
				//ns.tprint(info.wantedPenalty)
				switch (memberInfo.task) {
					case "Ethical Hacking":
						if (info.wantedPenalty > 0.999)
							g.setMemberTask(names[h], "Money Laundering")
						break;
					default:
						if (info.wantedPenalty < 0.99)
							g.setMemberTask(names[h], "Ethical Hacking")
						break;
				}
			}
			let equip = g.getEquipmentNames()
			for (let i = 0; i < equip.length; i++) {
				g.purchaseEquipment(names[h], equip[i])
			}
		}
	}
}