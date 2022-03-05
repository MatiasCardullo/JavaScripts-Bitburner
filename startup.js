import {_beep} from "./sounds/beep.js"
import { _coplandOsEnterprise } from "./sounds/coplandOsEnterprise.js"

/** @param {NS} ns **/
export async function main(ns) {
	let singularity=ns.args[0]
	let getGang=ns.args[1]
	ns.exec("singularity/upgradeHomeCoresCost.js","home")
	ns.exec("singularity/upgradeHomeRAMCost.js","home")
	let audio=[
		new Audio("data:audio/wav;base64,"+_beep),
		new Audio("data:audio/wav;base64,"+_coplandOsEnterprise),
	]
	audio[0].play();
	audio[1].play();
	await ns.sleep(3000)
	let file=ns.read("ascii_os.txt")
	file = file.split('\r\n')
	for (let i = 0; i < file.length; i++)
		ns.tprint(file[i])
	let oldLogs=ns.ls("home","_log.txt")
	for (let i = 0; i < oldLogs.length; i++)
		await ns.write(oldLogs[i],"","w")
	
	if(singularity==null)
		singularity=await ns.prompt("You have the singularity?")
	if(singularity)
		if(getGang==null)
			getGang=await ns.prompt("Do you want to form a gang?")
	if(ns.getServerMaxRam("home")<32){
		ns.exec("all_lite.js","home",1,singularity)
	}else{
		ns.exec("all.js","home",1,singularity)
	}
	if(singularity){
		ns.exec("autoContract.js","home")
		ns.exec("singularity/crime.js","home",1,getGang)
	}else{
		ns.exec("autoContract.js","home",1,true)
		ns.exec("hacknet.js","home")	
	}
}