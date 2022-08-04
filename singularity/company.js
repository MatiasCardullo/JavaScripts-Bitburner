import { runSafeScript } from "./lib/basicLib.js";
export const companies = [
	"Fulcrum Technologies", "MegaCorp", "ECorp", "Clarke Incorporated", "Bachman & Associates", "NWO",
	"KuaiGong International", "Four Sigma", "Blade Industries", "OmniTek Incorporated"
];

/** @param {NS} ns **/
export async function main(ns) {
	//ns.tail()
	let allCompanies = true;
	await runSafeScript(ns, "getPlayer.js")
	let player = JSON.parse(ns.read("/logs/playerStats.txt"))
	let focus; let companyRep; let faction;
	let maxRep = 200000
	if (player.hacking >= 250) {
		for (let i = 0; i < companies.length; i++) {
			faction = companies[i]
			if (companies[i] == "Fulcrum Technologies") {
				if (!ns.hasRootAccess("fulcrumassets") || player.factions.includes("Fulcrum Secret Technologies")) {
					continue;
				}
				maxRep = 250000
				faction = "Fulcrum Secret Technologies"
			}
			await runSafeScript(ns, "/company/getRep.js", companies[i])
			companyRep = parseFloat(ns.read("/company/" + companies[i].replaceAll(' ', '').replace('&', 'And') + "/reputation.txt"))
			if (companyRep < maxRep && !player.factions.includes(faction)) {
				allCompanies = false
				if (player.isWorking && player.location == companies[i]) {
					if (player.workRepGained / 2 + companyRep >= maxRep) {
						await runSafeScript(ns, "/singularity/stopAction.js")
					}
					break;
				} else {
					focus = !ns.read("/augments/installed.txt").includes("Neuroreceptor Management Implant")
					await runSafeScript(ns, "/company/apply.js", companies[i], "software")
					await runSafeScript(ns, "/company/work.js", companies[i], focus)
					await ns.write("/logs/company.txt", companies[i], 'w')
					break;
				}
			} else if (ns.read("/logs/company.txt") == companies[i]) {
				allCompanies = false
				break;
			}
		}
		if (allCompanies && ns.read("/logs/allCompanies.txt") == "") {
			await ns.write("/logs/allCompanies.txt", "true", 'w')
		}
	}
}