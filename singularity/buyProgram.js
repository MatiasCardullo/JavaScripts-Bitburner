import { speak } from "./lib/voice.js";

/** @param {NS} ns **/
export async function main(ns) {
	if (ns.purchaseProgram(ns.args[0])) {
		let text = "Purchased program " + ns.args[0]
		speak(text,11)
		ns.toast(text, "success", 15000)
	}
}