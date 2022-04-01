/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('getServerMoneyAvailable')
	var server = ns.args[0];
	var maxM = ns.args[1];
	/*var minS = ns.args[2];
	var level = ns.getServerSecurityLevel(server);*/
	var money = ns.getServerMoneyAvailable(server);
	var aux = 0; var numM = 0; //var numS = 0;
	while ((money / maxM * 100) < 90) {
		await ns.grow(server);
		await ns.sleep(1000)
		money = ns.getServerMoneyAvailable(server);
		aux = parseFloat(money / maxM * 100).toFixed(1);
		if (numM != aux) {
			numM = aux;
			ns.print(numM + "% grow");
		}
	}
	await ns.weaken(server)
}