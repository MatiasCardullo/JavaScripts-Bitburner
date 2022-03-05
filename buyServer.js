/** @param {NS} ns **/
export async function main(ns) {
	let servers = ns.args[0].split(',');
	let ram = ns.args[1]
	for (let i = 0; i < servers.length; i++) {
		if (!ns.serverExists(servers[i] + "_hack")) {
			if (ns.purchaseServer(servers[i] + "_hack", ram) !== "")
				ns.toast("Purchased server " + servers[i] + "_hack")
		}
	}
}