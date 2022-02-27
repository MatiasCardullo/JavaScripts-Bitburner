/** @param {NS} ns **/
export async function main(ns) {
	let servers = ["home"];
	for (let i = 0; i < servers.length; i++) {
		let thisScan = ns.scan(servers[i]);
		// Loop through results of the scan, and add any new servers
		for (let j = 0; j < thisScan.length; j++) {
			// If this server isn't in servers, add it
			if (servers.indexOf(thisScan[j]) === -1) {
				servers.push(thisScan[j]);
			}
		}
	}
	servers.splice(0, 1)
	for (let i = 0; i < servers.length; i++) {
		ns.killall(servers[i])
	}
}