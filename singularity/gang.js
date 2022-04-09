import { runSafeScript,runScript } from "./lib/basicLib.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.clearLog()
	let g = ns.gang;
	if (g.inGang()) {
		let moneyLeft = Math.pow(10,13)
		let baseWanted = 1;
		let totalChance = 0;
		await runSafeScript(ns, "/gang/getOtherGangInformation.js")
		let gangs = ns.read("/gang/allGangs/names.txt").split(',')
		for (let h = 0; h < gangs.length; h++) {
			await runSafeScript(ns, "/gang/getChance.js", gangs[h])
			totalChance += parseFloat(ns.read("/gang/allGangs/" + gangs[h].replaceAll(' ', '') +"/chanceToWinClash.txt"))
		}
		totalChance /= gangs.length;
		ns.run("/gang/setTerritoryWarfare.js", 1, totalChance > 0.75)
		ns.run("/gang/recruitMember.js", 1, Math.random() * 100000)
		let names = g.getMemberNames()
		await runSafeScript(ns, "/gang/getGangInformation.js")
		let memberInfo;
		for (let h = 0; h < names.length; h++) {
			let equip = g.getEquipmentNames()
			for (let i = 0; i < equip.length; i++) {
				if (ns.read("/gang/members/" + names[h]+".txt").includes(equip[i])) {
					continue;
				} else if (g.getEquipmentType(equip[i]) == "Augmentation") {
					if (g.getEquipmentCost(equip[i]) < ns.getServerMoneyAvailable("home") - moneyLeft) {
						await runScript(ns, "/gang/purchaseEquipment.js", names[h], equip[i])
					}
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
				let wantedPenalty = parseFloat(ns.read("/gang/info/wantedPenalty.txt"))
				switch (memberInfo.task) {
					case "Vigilante Justice":
						if (wantedPenalty > baseWanted - 0.00005)
							ns.run("/gang/setMemberTask.js", 1, names[h], "Terrorism")
						break;
					default:
						if (wantedPenalty < baseWanted - 0.0001)
							ns.run("/gang/setMemberTask.js", 1, names[h], "Vigilante Justice")
						break;
				}
			}
		}
		ns.run("/gang/setMemberTask.js", 1, names[names.length - 1], "Mug People")
		/*let output = "";
		for (var key in info) {
			output += key + ':' + info[key] + ','
		}
		await ns.write("/singularity/player/gang.txt", output, 'w')*/
	} else {
		g.createGang("Slum Snakes")
	}
}