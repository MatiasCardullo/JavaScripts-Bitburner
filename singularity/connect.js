/** @param {NS} ns **/
export async function main(ns) {
	let server=ns.args[0]
	if(server=="home"){
		ns.connect(server)
		ns.exit()
	}
	let path = scanNode("home", server, [])
	ns.connect(path[0])
	for (let i = 1; i < path.length; i++) {
		ns.connect(path[i])
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