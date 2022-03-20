export const companies = [
	"MegaCorp", "ECorp", "Clarke Incorporated", "Bachman & Associates", "NWO",
	"KuaiGong International", "Four Sigma", "Blade Industries", "OmniTek Incorporated", "Fulcrum Technologies"
];

/** @param {NS} ns **/
export async function main(ns) {
	let player = ns.getPlayer()
	let focus;let companyRep;
	let maxRep = 200000
	if (player.hacking >= 250) {
		for (let i = 0; i < companies.length; i++) {
			companyRep = ns.getCompanyRep(companies[i])
			if (companies[i] == "Fulcrum Technologies") {
				maxRep = 250000
			}
			if (companyRep < maxRep&&!player.factions.includes(companies[i])) {
				if (player.isWorking && player.location == companies[i]) {
					if (player.workRepGained / 2 + companyRep >= maxRep) {
						ns.stopAction()
					}
					break;
				} else {
					focus =!ns.read("/singularity/player/installedAugments.txt").includes("Neuroreceptor Management Implant")
					ns.run("/singularity/applyCompany.js", 1, companies[i], "software");
					while (ns.scriptRunning("/singularity/applyCompany.js", "home")) { await ns.sleep(0) }
					ns.run("/singularity/workCompany.js", 1, companies[i], focus);
					if (companies[i] == "Fulcrum Technologies") {
						ns.run("/singularity/connect.js", 1, "fulcrumassets")
						while (ns.scriptRunning("/singularity/connect.js", "home")) { await ns.sleep(0) }
						ns.run("/singularity/backdoor.js", "home")
						ns.toast(`Installing backdoor fulcrumassets`)
						while (ns.scriptRunning("/singularity/backdoor.js", "home")) { await ns.sleep(0) }
						ns.run("/singularity/connect.js", 1, "home")
					}
					break;
				}
			}
		}
	}
}