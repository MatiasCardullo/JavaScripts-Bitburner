import { speak } from "./sounds/voice.js";

/** @param {NS} ns */
export async function main(ns) {
	let name = ns.args[1].slice(0, ns.args[1].length - 4).replace('&', 'And')
	let answer = JSON.parse(ns.args[0])
	let result = ns.codingcontract.attempt(answer, ns.args[1], ns.args[2], {returnReward:true})
	if (result != "") {
		ns.toast(result, 'info', 10000)
		speak(result,11)
	}else{
		ns.toast(ns.args[1], 'error', 10000)
		result=false;
	}
	await ns.write("/cct/" + name + "/attempt.txt", result, 'w');
}