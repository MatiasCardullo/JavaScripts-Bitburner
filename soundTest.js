//import base64 strings from sound
//"https://codebeautify.org/mp3-to-base64-converter"
import {_beep} from "./sounds/beep.js"
import { _win95StartUp } from "./sounds/win95StartUp.js"
import { _coplandOsEnterprise } from "./sounds/coplandOsEnterprise.js"
//if the soundfile is long, divide the file into several parts because it will crash when you want to save a long file
import {_ZanderNoriega_DarkerWaves_1} from "./sounds/ZanderNoriega_DarkerWaves_1.js"
import {_ZanderNoriega_DarkerWaves_2} from "./sounds/ZanderNoriega_DarkerWaves_2.js"
import {_ZanderNoriega_DarkerWaves_3} from "./sounds/ZanderNoriega_DarkerWaves_3.js"

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL')
	ns.clearLog()
	//We save them as HTMLAudioElement, there I join the 3 parts of a song 
	let audio=[
		new Audio("data:audio/wav;base64,"+_beep),
		new Audio("data:audio/wav;base64,"+_coplandOsEnterprise),
		new Audio("data:audio/wav;base64,"+_ZanderNoriega_DarkerWaves_1+_ZanderNoriega_DarkerWaves_2+_ZanderNoriega_DarkerWaves_3)
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
	//And use .ended to know if is still playing or not
	await ns.sleep((audio[1].duration-4)*1000)
	audio[0].play();
	ns.toast(" Playing \"Darker Waves - Zander Noriega\"","info",10000)
	while(true){
		audio[2].play();
		await ns.sleep(audio[2].duration*1000)
	}
}