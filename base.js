/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('getServerMoneyAvailable')
	ns.disableLog('getServerSecurityLevel')
	var server = ns.args[0];
	var maxM = ns.args[1];
	var minS = ns.args[2];
	var threads = ns.args[3];
	var level = ns.getServerSecurityLevel(server);
	var money = ns.getServerMoneyAvailable(server);
	var auxM = 0; var auxS = 0; var numM = 0; var numS = 0;
	var numHack = ns.read(server + "Income.txt")
	if (numHack == "") {
		numHack = 0;
	}
	numHack = parseInt(numHack)
	/*if (ns.read(server + "_log.txt") == "")
		await ns.write(server + "_log.txt", money + '-' + new Date().getTime(), "w")*/
	while (true) {
		if (money < maxM) {
			await ns.grow(server);
			money = ns.getServerMoneyAvailable(server);
			//await ns.write(server + "_log.txt", money + '-' + new Date().getTime(), "a")
			auxM = parseFloat(money / maxM * 100).toFixed(2);
		} else if (level > minS) {
			await ns.weaken(server);
			level = ns.getServerSecurityLevel(server);
			auxS = parseFloat(minS / level * 100).toFixed(2);
		} else {
			while (money / maxM > 2 / 3 && minS / level > 2 / 3) {
				numHack += await ns.hack(server, { threads: Math.floor(threads / 4) });
				money = ns.getServerMoneyAvailable(server);
				//await ns.write(server + "_log.txt", money + '-' + new Date().getTime(), "a")
				await ns.write(server + "Income.txt", numHack, "w")
			}
			//ns.print(numHack + " stolen from " + server);
			level = ns.getServerSecurityLevel(server);
		}
		if (numS != auxS && numM != auxM) {
			numM = auxM; numS = auxS;
			ns.print(numM + "% grow " + numS + "% lowSecurity");
		}

	}
}