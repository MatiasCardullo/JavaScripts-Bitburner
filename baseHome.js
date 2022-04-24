/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('getServerMoneyAvailable')
	ns.disableLog('getServerSecurityLevel')
	let server = ns.args[0];
	let maxM = ns.args[1];
	let minS = ns.args[2];
	let level = ns.getServerSecurityLevel(server);
	let money = ns.getServerMoneyAvailable(server);
	while (true) {
		if (money < maxM) {
			await ns.grow(server);
			money = ns.getServerMoneyAvailable(server);
		} else if (level > minS) {
			await ns.weaken(server);
			level = ns.getServerSecurityLevel(server);
		} else {
			break;
		}
	}
}