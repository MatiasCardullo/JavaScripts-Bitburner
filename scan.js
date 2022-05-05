/** @param {NS} ns */
export async function main(ns) {
	let servers = ["home"];
	let output = [];
	//await ns.write("scan.txt", "Name,HackLevel,Ports,RAM,Grow,MaxMoney,MinSecurity,StartMoney,StartSecurity", "w")
	for (let i = 0; i < servers.length; i++) {
		var aux = ns.scan(servers[i]);
		for (let j = 0; j < aux.length; j++) {
			if (!servers.includes(aux[j])) {
				servers.push(aux[j]);
				output.push(ns.getServer(aux[j]))
			}
		}
	}
	await ns.write("scan.txt", JSON.stringify(output, null, '\t'), "w");
}