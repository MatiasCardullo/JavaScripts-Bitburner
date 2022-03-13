/** @param {NS} ns **/
export async function main(ns) {
	let servers = ["home"];
	let myServers = ns.getPurchasedServers()
	for (let i = 0; i < servers.length; i++) {
		var aux = ns.scan(servers[i]);
		for (let j = 0; j < aux.length; j++) {
			if (!servers.includes(aux[j]) && !myServers.includes(aux[j])&&aux[j]!=="darkweb") {
				servers.push(aux[j]);
			}
		}
	}
	for (let i = 0; i < servers.length; i++) {
		await backdoor(servers[i])
	}
	
	async function backdoor(server) {
		let path = scanNode("home", server, [])
		for (let i = 0; i < path.length; i++) {
			ns.run("/singularity/connect.js", 1, path[i])
			await ns.sleep(10);
		}
		ns.run("/singularity/backdoor.js")
		await ns.sleep(10);
		ns.run("/singularity/connect.js", 1, "home")
	}

	function scanNode(node, target, scanedServers) {
		let servers = ns.scan(node).filter((server) => !scanedServers.includes(server));
		scanedServers.push(...servers);

		if (servers.includes(target)) return [target];

		for (let server of servers) {
			const path = scanNode(server, target, scanedServers);
			if (path) return [server, ...path]
		}

		return '';
	}
}