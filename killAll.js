/** @param {NS} ns **/
export async function main(ns) {
	if(ns.args[0]==null){
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
		for (let i = servers.length-1; i>-1; i--) {
			ns.killall(servers[i])
		}
	}else{
		ns.killall(ns.args[0])
	}
}