/** @param {NS} ns **/
export async function main(ns) {
	let servers = ["home"];
	let myServers = ns.getPurchasedServers()
	let line = "ServerName,HackLevel,Ports,RAM,MaxMoney,MinSecurity\n";
	line = line.replace("\\n", "\n");
	await ns.write("SERVERDATA.txt", line, "w")
	for (let i = 0; i < servers.length; i++) {
		var aux = ns.scan(servers[i]);
		for (let j = 0; j < aux.length; j++) {
			if (!servers.includes(aux[j]) && !myServers.includes(aux[j])&&aux[j]!=="darkweb") {
				servers.push(aux[j]);
				line = aux[j] + "," +
					ns.getServerRequiredHackingLevel(aux[j]) + "," +
					ns.getServerNumPortsRequired(aux[j]) + "," +
					ns.getServerMaxRam(aux[j]) + "," +
					ns.getServerMaxMoney(aux[j]) + "," +
					ns.getServerMinSecurityLevel(aux[j]) + "\n";
				//line=line.replace("\\n", "\n");
				await ns.write("SERVERDATA.txt", line, "a");
			}
		}
	}
}