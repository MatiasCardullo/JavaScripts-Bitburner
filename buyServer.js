import { speak } from "./sounds/voice.js";

/** @param {NS} ns **/
export async function main(ns) {
	let output = []
	let myServers=ns.read("myServers.txt").split(',')
	let servers = ns.args[0].split(',');
	for (let i = 0; i < servers.length; i++) {
		if (ns.serverExists(servers[i] + "_hack")) {
			output.push(servers[i] + "_hack")
		} else if (ns.purchaseServer(servers[i] + "_hack", ns.args[1]) !== "") {
			let text=`Purchased server "${servers[i]}_hack"`
			//speak(text,11)
			ns.toast(text,"success",15000)
			output.push(servers[i] + "_hack")
		}
	}
	if(myServers!==output)
		await ns.write("myServers.txt", output, 'w')
}