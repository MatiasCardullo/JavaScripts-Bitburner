import { speak } from "./sounds/voice.js";

/** @param {NS} ns **/
export async function main(ns) {
	let path; let file; let aux = 0;
	let price = ns.stock.sell(ns.args[0], ns.args[1]);
	if (price > 0) {
		let notif = 'StockMarket: Sold ' + ns.nFormat(price * ns.args[1], '0a') + ' from ' + ns.read("/stock/" + ns.args[0] + "/name.txt").split(',')[0]
		speak(notif,11)
		ns.toast(notif, 'success', 60000)
		path = "/stock/" + ns.args[0] + "/myShares.txt"
		file = ns.read(path)
		if (parseInt(file) > ns.args[1])
			aux = parseInt(file) - ns.args[1]
		await ns.write(path, aux, 'w')
		path = "/stock/" + ns.args[0] + "/invested.txt"
		file = ns.read(path)
		await ns.write(path, parseInt(file) + price * ns.args[1], 'w')
	}
}