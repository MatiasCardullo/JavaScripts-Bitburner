/** @param {NS} ns **/
export async function main(ns) {
	let servers = ["home"];
	let myServers = ns.getPurchasedServers()
	for (let i = 0; i < servers.length; i++) {
		var aux = ns.scan(servers[i]);
		for (let j = 0; j < aux.length; j++) {
			if (!servers.includes(aux[j]) && !myServers.includes(aux[j]) && aux[j] !== "darkweb") {
				servers.push(aux[j]);
			}
		}
	}
	for (let i = 0; i < servers.length; i++) {
		await backdoor(servers[i])
	}

	async function backdoor(server) {
		let pid;
		pid = ns.run("/singularity/connect.js", 1, server)
		while (ns.isRunning(pid)) { await ns.sleep(0) }
		pid = ns.run("/singularity/backdoor.js")
		while (ns.isRunning(pid)) { await ns.sleep(0) }
		pid = ns.run("/singularity/connect.js", 1, "home")
		while (ns.isRunning(pid)) { await ns.sleep(0) }
	}
}