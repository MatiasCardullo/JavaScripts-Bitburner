import { _beep } from "./sounds/beep.js"
import { _coplandOsEnterprise } from "./sounds/coplandOsEnterprise.js"
import { runSafeScript, runScript } from "./lib/basicLib.js";

/** @param {NS} ns **/
export async function main(ns) {
	let scaner = ns.args[0]
	let singularity = ns.args[1]
	let doCrime = ns.args[2]
	let getGang = ns.args[3]
	let setGang = true
	let audio = [
		new Audio("data:audio/wav;base64," + _beep),
		new Audio("data:audio/wav;base64," + _coplandOsEnterprise),
	]
	await runSafeScript(ns, "reset.js")
	if (scaner == null)
		scaner = await ns.prompt("Start Scan")
	if (scaner)
		await runSafeScript(ns, "startScan.js")
	await runSafeScript(ns, "/singularity/upgradeHomeCoresCost.js")
	await runSafeScript(ns, "/singularity/upgradeHomeRAMCost.js")
	if (singularity == null)
		singularity = await ns.prompt("You have the singularity?")
	if (doCrime == null)
		doCrime = await ns.prompt("Do Crime?")
	if (singularity) {
		if (getGang == null)
			getGang = await ns.prompt("Do you want to form a gang?")
		await runSafeScript(ns, "/gang/getMembersInformation.js")
		let file = ns.read("/gang/membersInfo.txt")
		if (file != "") {
			let arrayMembers = JSON.parse(file)
			if (arrayMembers.length == 12)
				for (let i in arrayMembers)
					await runSafeScript(ns, "/gang/ascendMember.js", arrayMembers[i].name)
		}
	} else {
		getGang = false;
		setGang = false;
	}
	audio[0].play();
	audio[1].play();
	await ns.sleep(3000)
	ns.tprint("\n" + ns.read("ascii_os.txt"))
	await runScript(ns, "all.js", singularity, doCrime, getGang, setGang)
	if (!singularity) {
		await runSafeScript(ns, "hacknet.js")
	}
}