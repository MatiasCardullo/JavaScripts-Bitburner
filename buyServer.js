/** @param {NS} ns **/
export async function main(ns) {
	let servers = ns.args[0].split(',');
	for (let i = 0; i < servers.length; i++) {
		if (!ns.serverExists(servers[i] + "_hack")) {
			if (ns.purchaseServer(servers[i] + "_hack", ns.args[1]) !== ""){
				let output=""
				ns.toast(`Purchased server "${servers[i]}_hack"`)
				if(ns.read("purchasedServers.txt")!="")
					output+=','
				ns.write("purchasedServers.txt",output,'a')
			}
		}
	}
}