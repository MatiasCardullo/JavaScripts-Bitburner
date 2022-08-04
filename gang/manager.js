import { runSafeScript, runScript } from "./lib/basicLib.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.clearLog()
	//ns.tail()
	ns.disableLog('getServerMoneyAvailable')
	let file;
	if (ns.gang.inGang()) {
		let player = JSON.parse(ns.read("/logs/playerStats.txt"))
		let totalChance = 0;
		await runSafeScript(ns, "/gang/getOtherGangInformation.js")
		await runSafeScript(ns, "/gang/getChance.js")
		totalChance = parseFloat(ns.read("/gang/totalChanceToWinClash.txt"));
		//ns.tprint("gang total chance " + totalChance)
		await runSafeScript(ns, "/gang/getGangInformation.js")
		let infoGang = JSON.parse(ns.read("/gang/info.txt"))
		//ns.tprint(infoGang.wantedLevel)
		if (infoGang.territory < 1)
			await runScript(ns, "/gang/setTerritoryWarfare.js", totalChance > 0.79 - infoGang.territory)
		else if (infoGang.territoryWarfareEngaged) {
			await runScript(ns, "/gang/setTerritoryWarfare.js", false)
		}
		await runSafeScript(ns, "/gang/getMembersInformation.js")
		let members = JSON.parse(ns.read("/gang/membersInfo.txt"))
		await runSafeScript(ns, "/gang/recruitMember.js", "member" + ns.nFormat(members.length, '00'))
		file = ns.read("/gang/equipment.txt")
		if (file == "") {
			await runSafeScript(ns, "/gang/getEquipmentData.js")
			file = ns.read("/gang/equipment.txt")
		}
		let equipment = JSON.parse(file)
		let fullEquipment = true; let fullUpgrades = true
		let wanted; let limit;
		if (infoGang.wantedPenalty < 0.999) {
			wanted = infoGang.wantedLevel
			limit = members.length
		} else {
			wanted = infoGang.wantedPenalty
			limit = 1
			//ns.toast(infoGang.wantedPenalty)
		}
		if (getDiscount(infoGang) < 0.001)
			await runScript(ns, "/gang/ascendAll.js");
		for (let h = 0; h < members.length; h++) {
			if (player.bitNodeN != 12)
				for (let i = 0; i < equipment.length; i++) {
					if (members[h].upgrades.includes(equipment[i].name))
						continue;
					else if (members[h].augmentations.includes(equipment[i].name)) {
						fullUpgrades = false;
						continue;
					} else {
						fullEquipment = false;
						//ns.toast(getDiscount(infoGang))
						if (equipment[i].cost * getDiscount(infoGang) < ns.getServerMoneyAvailable("home"))
							await runSafeScript(ns, "/gang/purchaseEquipment.js", members[h].name, equipment[i].name);
					}
				}
			if (infoGang.territory < 1 && h != 0 && (members.length == 12 || totalChance > 0.7)) {
				if (members[h].task !== "Territory Warfare")
					await runScript(ns, "/gang/setMemberTask.js", members[h].name, "Territory Warfare")
			} else {
				let task;
				if (infoGang.power > 20000 || h + 8 < members.length || members.length == 12)
					task = "Human Trafficking"
				else if (h + 3 < members.length)
					task = "Run a Con"
				else
					task = "Mug People"
				/*if (infoGang.wantedLevel < 2 && members[h].task !== "Cyberterrorism")
					await runScript(ns, "/gang/setMemberTask.js", members[h].name, "Cyberterrorism")
				if (infoGang.wantedLevel > 2 && members[h].task !== "Vigilante Justice")
					await runScript(ns, "/gang/setMemberTask.js", members[h].name, "Vigilante Justice")*/
				if (wanted < limit && members[h].task !== task)
					await runScript(ns, "/gang/setMemberTask.js", members[h].name, task)
				if (wanted > limit && members[h].task !== "Vigilante Justice")
					await runScript(ns, "/gang/setMemberTask.js", members[h].name, "Vigilante Justice")
			}
		}
		if (fullEquipment && members.length == 12)
			await ns.write("/gang/fullEquip.txt", true, 'w')
	} else {
		ns.gang.createGang("Slum Snakes")
	}
}

export function getDiscount(infoGang) {
	const respectLinearFac = 5e6;
	const powerLinearFac = 1e6;
	const discount =
		Math.pow(infoGang.respect, 0.01) + infoGang.respect / respectLinearFac +
		Math.pow(infoGang.power, 0.01) + infoGang.power / powerLinearFac - 1;
	return 1 / Math.max(1, discount);
}