import { runSafeScript } from "./lib/basicLib.js";

/** @param {NS} ns **/
export async function main(ns) {
	let ignore = ["/logs/bitnodeMultipliers.txt", "/logs/bladeburner.txt", "/bladeburner/doneBlackOps.txt", "/augments/stanek/activeFragments.txt"]
	let rmFiles = ns.ls("home", "/singularity/")
		.concat(ns.ls("home", "/augments/"))
		.concat(ns.ls("home", "/factions/"))
		.concat(ns.ls("home", "/stock/"))
		.concat(ns.ls("home", "/gang/"))
		.concat(ns.ls("home", "/bladeburner/"))
		.concat(ns.ls("home", "/sleeves/"))
		.concat(ns.ls("home", "/hacknet/"))
		.concat(ns.ls("home", "/logs/"))
	rmFiles.forEach((f) => f.endsWith(".txt") && !ignore.includes(f) ? ns.rm(f) : null)
	ns.rm("/augments/grafting.txt")
	var symbolMap = [
		["AERO", "AeroCorp", "aerocorp"],
		["APHE", "Alpha Enterprises", "alpha-ent"],
		["BLD", "Blade Industries", "blade"],
		["CLRK", "Clarke Incorporated", "clarkinc"],
		["CTK", "CompuTek", "comptek"],
		["CTYS", "Catalyst Ventures", "catalyst"],
		["DCOMM", "DefComm", "defcomm"],
		["ECP", "ECorp", "ecorp"],
		["FLCM", "Fulcrum Technologies", "fulcrumtech"],
		["FNS", "FoodNStuff", "foodnstuff"],
		["FSIG", "Four Sigma", "4sigma"],
		["GPH", "Global Pharmaceuticals", "global-pharm"],
		["HLS", "Helios Labs", "helios"],
		["ICRS", "Icarus Microsystems", "icarus"],
		["JGN", "Joe's Guns", "joesguns"],
		["KGI", "KuaiGong International", "kuai-gong"],
		["LXO", "LexoCorp", "lexo-corp"],
		["MDYN", "Microdyne Technologies", "microdyne"],
		["MGCP", "MegaCorp", "megacorp"],
		["NTLK", "NetLink Technologies", "netlink"],
		["NVMD", "Nova Medical", "nova-med"],
		["OMGA", "Omega Software", "omega-net"],
		["OMN", "Omnia Cybersystems", "omnia"],
		["OMTK", "OmniTek Incorporated", "omnitek"],
		["RHOC", "Rho Contruction", "rho-construction"],
		["SGC", "Sigma Cosmetics", "sigma-cosmetics"],
		["SLRS", "Solaris Space Systems", "solaris"],
		["STM", "Storm Technologies", "stormtech"],
		["SYSC", "SysCore Securities", "syscore"],
		["TITN", "Titan Laboratories", "titan-labs"],
		["UNV", "Universal Energy", "univ-energy"],
		["VITA", "VitaLife", "vitalife"],
		["WDS", "Watchdog Security", ""]
	];
	for (let i = 0; i < symbolMap.length; i++) {
		await ns.write("/stock/" + symbolMap[i].shift() + "/name.txt", symbolMap[i], 'w')
	}
	await runSafeScript(ns, "/stock/getSymbols.js")
	await runSafeScript(ns, "/sleeves/getNum.js")
	await runSafeScript(ns, "/singularity/getCrimeStats.js")
	await runSafeScript(ns, "/augments/namesAndInfo.js")
	await runSafeScript(ns, "/augments/getGraftables.js")
	await runSafeScript(ns, "/augments/getGraftPrice.js")
	await runSafeScript(ns, "/augments/getGraftTime.js")
}