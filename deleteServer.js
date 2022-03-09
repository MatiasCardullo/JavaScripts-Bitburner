/** @param {NS} ns **/
export async function main(ns) {
	let servers=ns.args;
	if(servers.length==0)
		servers=ns.getPurchasedServers();
	for (let i = 0; i < servers.length; i++){
		ns.killall(servers[i])
		ns.deleteServer(servers[i])
	}
}