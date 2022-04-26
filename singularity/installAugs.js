import { _chargeSound } from "./sounds/chargeSound.js"

/** @param {NS} ns **/
export async function main(ns) {
	await ns.sleep(5000)
	new Audio("data:audio/wav;base64," + _chargeSound).play()
	ns.singularity.stopAction()
	ns.singularity.installAugmentations("autoStart.js")
}