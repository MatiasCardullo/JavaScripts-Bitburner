import { speak } from "./sounds/voice.js";

/** @param {NS} ns */
export async function main(ns) {
	if (ns.singularity.purchaseAugmentation(ns.args[0], ns.args[1])) {
		let output = "Purchased " + ns.args[1] + " from " + ns.args[0]
		speak(output, 11)
		ns.toast(output, "success", 60000)
	}
}