import { runSafeScript, runScript } from "./lib/basicLib.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.clearLog()
	ns.disableLog('getServerMoneyAvailable')
	let file;
	let g = ns.gang;
	if (g.inGang()) {
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
		await runScript(ns, "/gang/setTerritoryWarfare.js", totalChance > 0.6)
		await runSafeScript(ns, "/gang/getMembersInformation.js")
		let members = JSON.parse(ns.read("/gang/membersInfo.txt"))
		file = ns.read("/gang/equipment.txt")
		if (file == "")
			await runSafeScript(ns, "/gang/getEquipmentData.js")
		let equipment = JSON.parse(file)
		for (let h = 0; h < members.length; h++) {
			for (let i = 0; i < equipment.length; i++) {
				if (ns.read("/gang/members/" + members[h].name + ".txt").includes(equipment[i].name)) {
					continue;
				} else if (serversBought && equipment[i].cost < ns.getServerMoneyAvailable("home")) {
					await runScript(ns, "/gang/purchaseEquipment.js", members[h].name, equipment[i].name)
				}
			}
			if (infoGang.territory < 1 && members.length == 12) {
				if (members[h].task !== "Territory Warfare")
					ns.run("/gang/setMemberTask.js", 1, members[h].name, "Territory Warfare")
			} else {
				let task;
				if (infoGang.territory > 0.25 || 0 > (h - 5))
					task = "Human Trafficking"
				else
					task = "Run a Con"
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
		g.createGang("Slum Snakes")
	}
}