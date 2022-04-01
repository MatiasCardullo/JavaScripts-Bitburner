export const companies = [
	"MegaCorp", "ECorp","Fulcrum Technologies", "Clarke Incorporated", "Bachman & Associates", "NWO",
	"KuaiGong International", "Four Sigma", "Blade Industries", "OmniTek Incorporated"
];

/** @param {NS} ns **/
export async function main(ns) {
	//ns.tail()
	let allCompaies=true;
	let player = ns.getPlayer()
	let upgrade = player.factions.includes("Fulcrum Secret Technologies")
	if (upgrade) {
		let pid = ns.run("/singularity/getMyAugments.js")
		while (ns.isRunning(pid)) await ns.sleep(0)
		upgrade = ns.read("/singularity/player/installedAugments.txt").includes("PC Direct-Neural Interface NeuroNet Injector")
	}
	let focus; let companyRep; let faction;
	let maxRep = 200000
	if (player.hacking >= 250) {
		for (let i = 0; i < companies.length; i++) {
			faction = companies[i]
			if (companies[i] == "Fulcrum Technologies") {
				if(!ns.hasRootAccess("fulcrumassets")||player.factions.includes("Fulcrum Secret Technologies")){
					continue;
				}
				maxRep = 250000
				faction = "Fulcrum Secret Technologies"
			}
			companyRep = ns.getCompanyRep(companies[i])
			if (companyRep < maxRep && !player.factions.includes(faction)) {
				allCompaies=false
				if (player.isWorking && player.location == companies[i]) {
					if (player.workRepGained / 2 + companyRep >= maxRep) {
						ns.stopAction()
					}
					break;
				} else {
					focus = !ns.read("/singularity/player/installedAugments.txt").includes("Neuroreceptor Management Implant")
					ns.run("/singularity/applyCompany.js", 1, companies[i], "software");
					while (ns.scriptRunning("/singularity/applyCompany.js", "home")) { await ns.sleep(0) }
					ns.run("/singularity/workCompany.js", 1, companies[i], focus);
					break;
				}
			}
		}
		if(allCompaies&&ns.read("/singularity/player/allCompaies.txt")){
			await ns.write("/singularity/player/allCompaies.txt","true",'w')
		}
	}
}