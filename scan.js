/** @param {NS} ns **/
export async function main(ns) {
	let servers = ["home"];
	let output=[]
	let line="serverName,hackLevel,RAM,maxMoney,minSecurity\n";
	line=line.replace("\\n", "\n");
	await ns.write("SERVERDATA",line,"w")
	for (let i = 0; i < servers.length; i++) {
		var aux = ns.scan(servers[i]);
		for (let j = 0; j < aux.length; j++) {
			if (servers.indexOf(aux[j]) === -1) {
				servers.push(aux[j]);
				line=aux[j]+","+ns.getServerRequiredHackingLevel(aux[j])+","+ns.getServerMaxRam(aux[j])+","+ns.getServerMaxMoney(aux[j])+","+ns.getServerMinSecurityLevel(aux[j])+"\n";
				line=line.replace("\\n", "\n");
				await ns.write("SERVERDATA",line,"a");
			}
		}
	}
}