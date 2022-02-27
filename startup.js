import {_beep} from "./sounds/beep.js"
import { _coplandOsEnterprise } from "./sounds/coplandOsEnterprise.js"

/** @param {NS} ns **/
export async function main(ns) {
	let audio=[
		new Audio("data:audio/wav;base64,"+_beep),
		new Audio("data:audio/wav;base64,"+_coplandOsEnterprise),
	]
	//with .play() it plays
	audio[0].play();
	audio[1].play();
	await ns.sleep(3000)
	//Just the fancy logo
	let file=ns.read("ascii_os.txt")
	file = file.split('\r\n')
	for (let i = 0; i < file.length; i++)
		ns.tprint(file[i])
	ns.exec("all.js","home")
	ns.exec("hacknet.js","home")
	ns.exec("autoContract.js","home")
	//ns.exec("computerMusic.js","home")
}