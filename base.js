/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('getServerMoneyAvailable')
	ns.disableLog('getServerSecurityLevel')
	let server = ns.args[0];
	let maxM = ns.args[1];
	let minS = ns.args[2];
	let threads = ns.args[3];
	let level = ns.getServerSecurityLevel(server);
	let money = ns.getServerMoneyAvailable(server);
	let auxM = 0; var auxS = 0; var numM = 0; var numS = 0;
	let numHack = ns.read(server + "Income.txt")
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
			await ns.weaken(server);
			//ns.print(numHack + " stolen from " + server);
			level = ns.getServerSecurityLevel(server);
		}
		if (numS != auxS && numM != auxM) {
			numM = auxM; numS = auxS;
			ns.print(numM + "% grow " + numS + "% lowSecurity");
		}

	}
}