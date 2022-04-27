import { runSafeScript, runScript } from "./lib/basicLib.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.clearLog()
	ns.disableLog('getServerMoneyAvailable')
	let file;
	if (ns.gang.inGang()) {
		let serversBought = ns.read("myServers.txt").split(',').length == 25
		let totalChance = 0;
		await runSafeScript(ns, "/gang/getOtherGangInformation.js")
		await runSafeScript(ns, "/gang/getChance.js")
		totalChance = parseFloat(ns.read("/gang/totalChanceToWinClash.txt"));
		//ns.tprint("gang total chance " + totalChance)
		await runScript(ns, "/gang/recruitMember.js", parseInt(Math.random() * 1000000))
		await runSafeScript(ns, "/gang/getGangInformation.js")
		let infoGang = JSON.parse(ns.read("/gang/info.txt"))
		//ns.tprint(infoGang.wantedLevel)
		if (infoGang.territory < 1)
			await runScript(ns, "/gang/setTerritoryWarfare.js", totalChance > 0.5)
		await runSafeScript(ns, "/gang/getMembersInformation.js")
		let members = JSON.parse(ns.read("/gang/membersInfo.txt"))
		file = ns.read("/gang/equipment.txt")
		if (file == "") {
			await runSafeScript(ns, "/gang/getEquipmentData.js")
			file = ns.read("/gang/equipment.txt")
		}
		let equipment = JSON.parse(file)
		let fullEquipment = true
		for (let h = 0; h < members.length; h++) {
			for (let i = 0; i < equipment.length; i++) {
				if (members[h].upgrades.includes(equipment[i].name)||members[h].augmentations.includes(equipment[i].name)) {
					continue;
				} else if (serversBought) {
					fullEquipment = false;
					await runScript(ns, "/gang/purchaseEquipment.js", members[h].name, equipment[i].name);
				}
			}
			if (infoGang.territory < 1 && members.length == 12 && serversBought && fullEquipment) {
				if (members[h].task !== "Territory Warfare")
					ns.run("/gang/setMemberTask.js", 1, members[h].name, "Territory Warfare")
			} else {
				let task;
				if (infoGang.power > 20000 )
					task = "Human Trafficking"
				else
					task = "Deal Drugs"
				/*if (infoGang.wantedLevel < 2 && members[h].task !== "Cyberterrorism")
					await runScript(ns, "/gang/setMemberTask.js", members[h].name, "Cyberterrorism")
				if (infoGang.wantedLevel > 2 && members[h].task !== "Vigilante Justice")
					await runScript(ns, "/gang/setMemberTask.js", members[h].name, "Vigilante Justice")*/
				if (infoGang.wantedLevel < 5 && members[h].task !== task)
					await runScript(ns, "/gang/setMemberTask.js", members[h].name, task)
				if (infoGang.wantedLevel > 5 && members[h].task !== "Vigilante Justice")
					await runScript(ns, "/gang/setMemberTask.js", members[h].name, "Vigilante Justice")
			}
		}
	} else {
		ns.gang.createGang("Slum Snakes")
	}
}