import { _beep } from "./sounds/beep.js"
import { _coplandOsEnterprise } from "./sounds/coplandOsEnterprise.js"
import { runSafeScript, runScript } from "./lib/basicLib.js";

/** @param {NS} ns **/
export async function main(ns) {
	let scaner = ns.args[0]
	let singularity = ns.args[1]
	let doCrime = ns.args[2]
	let getGang = ns.args[3]
	let setGang = ns.args[4]
	let audio = [
		new Audio("data:audio/wav;base64," + _beep),
		new Audio("data:audio/wav;base64," + _coplandOsEnterprise),
	]
	await runSafeScript(ns, "reset.js")
	await runScript(ns, "getPlayer.js")
	if (scaner == null)
		scaner = await ns.prompt("Start Scan")
	if (scaner)
		await runScript(ns, "startScan.js")
	if (singularity == null)
		singularity = await ns.prompt("You have the singularity?")
	if (singularity) {
		await runScript(ns, "/singularity/upgradeHomeCoresCost.js")
		await runScript(ns, "/singularity/upgradeHomeRAMCost.js")
		await runScript(ns, "/singularity/getCrimeStats.js")
		if (doCrime == null)
			doCrime = await ns.prompt("Do Crime?")
		if (getGang == null) {
			getGang = await ns.prompt("Do you want to form a gang?")
			setGang = getGang
		}
		if (!getGang && setGang) {
			await runSafeScript(ns, "/gang/getMembersInformation.js")
			let arrayMembers = ns.read("/gang/membersInfo.txt")
			try {
				arrayMembers = JSON.parse(arrayMembers)
				if (arrayMembers.length == 12)
					for (let i in arrayMembers)
						await runSafeScript(ns, "/gang/ascendMember.js", arrayMembers[i].name)
			} catch { }
		}
	} else {
		doCrime = false;
		getGang = false;
		setGang = false;
	}
	audio[0].play();
	audio[1].play();
	await ns.sleep(3000)
	ns.tprint('\n' + ns.read("ascii_os.txt"))
	await runScript(ns, "all.js", singularity, doCrime, getGang, setGang)
}