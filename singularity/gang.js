import { runSafeScript } from "./lib/basicLib.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.clearLog()
	let g = ns.gang;
	if (g.inGang()) {
		let gangs = g.getOtherGangInformation();
		let gangCount = 0;
		let moneyLeft = 1000000000
		let moneyLeft2 = moneyLeft * 10000
		let totalChance = 0;
		let baseWanted = parseFloat(ns.read("/gang/wantedPenalty.txt"));
		for (var key in gangs) {
			gangCount++
			await runSafeScript(ns, "/gang/getChance.js", key)
			totalChance += parseFloat(ns.read("/gang/" + key.replaceAll(' ', '') + ".txt"))
			//output += "\n" + key + ':';
			/*for (var key2 in gangs[key]) {
				output += "\n   " + key2 + ':' + gangs[key][key2];
			}*/
		}
		totalChance /= gangCount;
		ns.run("/gang/setTerritoryWarfare.js", 1, totalChance > 0.75)
		//ns.write("gangsInfo.txt", output, 'w')
		ns.run("/gang/recruitMember.js", 1, Math.random() * 100000)
		let names = g.getMemberNames()
		let info = g.getGangInformation()
		let memberInfo;
		//ns.tprint(info.wantedPenalty)
		for (let h = 0; h < names.length; h++) {
			let equip = g.getEquipmentNames()
			let pid;
			for (let i = 0; i < equip.length; i++) {
				if (ns.read("/gang/members/" + names[h]).includes(equip[i])) {
					continue;
				} else if (g.getEquipmentType(equip[i]) != "Augmentation") {
					if (g.getEquipmentCost(equip[i]) < ns.getServerMoneyAvailable("home") - moneyLeft) {
						await runSafeScript(ns, "/gang/purchaseEquipment.js", names[h], equip[i])
					}
				} else if (g.getEquipmentCost(equip[i]) < ns.getServerMoneyAvailable("home") - moneyLeft2) {
					await runSafeScript(ns, "/gang/purchaseEquipment.js", names[h], equip[i])
				}
			}
			if (h >= names.length - 1) {
				break;
			}
			memberInfo = g.getMemberInformation(names[h])
			if (h > 0 && totalChance > 0.749) {
				if (memberInfo.task !== "Territory Warfare")
					ns.run("/gang/setMemberTask.js", 1, names[h], "Territory Warfare")
			} else {
				switch (memberInfo.task) {
					case "Ethical Hacking":
						if (info.wantedPenalty > baseWanted - 0.00005)
							ns.run("/gang/setMemberTask.js", 1, names[h], "Money Laundering")
						break;
					default:
						if (info.wantedPenalty < baseWanted - 0.0001)
							ns.run("/gang/setMemberTask.js", 1, names[h], "Ethical Hacking")
						break;
				}
			}
		}
		ns.run("/gang/setMemberTask.js", 1, names[names.length - 1], "Territory Warfare")
		/*let output = "";
		for (var key in info) {
			output += key + ':' + info[key] + ','
		}
		await ns.write("/singularity/player/gang.txt", output, 'w')*/
	} else {
		g.createGang("Speakers for the Dead")
		await ns.write("/gang/wantedPenalty.txt", g.getGangInformation().wantedPenalty, "w")
	}
}