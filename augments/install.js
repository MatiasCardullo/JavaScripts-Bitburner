import { setInput } from "./lib/basicLib.js";
import { _chargeSound } from "./sounds/chargeSound.js"

/** @param {NS} ns **/
export async function main(ns) {
	new Audio("data:audio/wav;base64," + _chargeSound).play()
	ns.singularity.stopAction()
	if (ns.isRunning("computerMusic.js")){
		setInput("stop")
		await ns.sleep(500)
	}
	ns.singularity.installAugmentations("autoStart.js")
}