import { runSafeScript, runScript } from "./lib/basicLib.js";
/** @param {NS} ns */
export async function main(ns) {
	await runSafeScript(ns, "/gang/getMembersInformation.js")
	let arrayMembers = ns.read("/gang/membersInfo.txt")
	try {
		arrayMembers = JSON.parse(arrayMembers)
		for (let i in arrayMembers)
			await runScript(ns, "/gang/ascendMember.js", arrayMembers[i].name)
	} catch { }
}