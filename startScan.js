/** @param {NS} ns **/
export async function main(ns) {
	let servers = ["home"];
	let myServers = ""
	let line;
	await ns.write("SERVERDATA.txt", "Name,HackLevel,Ports,RAM,Grow,MaxMoney,MinSecurity,StartMoney,StartSecurity", "w")
	for (let i = 0; i < servers.length; i++) {
		var aux = ns.scan(servers[i]);
		for (let j = 0; j < aux.length; j++) {
			if (!servers.includes(aux[j]) && aux[j] !== "darkweb") {
				servers.push(aux[j]);
				if (aux[j].endsWith("_hack")) {
					if (myServers != "")
						myServers += ','
					myServers += aux[j]
				} else {
					line = "\n" + aux[j] + "," +
						ns.getServerRequiredHackingLevel(aux[j]) + "," +
						ns.getServerNumPortsRequired(aux[j]) + "," +
						ns.getServerMaxRam(aux[j]) + "," +
						ns.getServerGrowth(aux[j]) + "," +
						ns.getServerMaxMoney(aux[j]) + "," +
						ns.getServerMinSecurityLevel(aux[j]) + "," +
						ns.getServerMoneyAvailable(aux[j]) + ',' +
						ns.getServerSecurityLevel(aux[j]);
					await ns.write("SERVERDATA.txt", line, "a");
				}
			}
		}
	}
	await ns.write("myServers.txt", myServers, "w");
}