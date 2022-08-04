/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('getServerMoneyAvailable')
	let server = ns.args[0];
	let maxM = ns.args[1];
	/*var minS = ns.args[2];
	var level = ns.getServerSecurityLevel(server);*/
	let money = ns.getServerMoneyAvailable(server);
	let aux = 0; var numM = 0; //var numS = 0;
	while ((money / maxM * 100) < 90) {
		ns.print(new Date().toString())
		await ns.grow(server);
		await ns.sleep(1000)
		money = ns.getServerMoneyAvailable(server);
		aux = parseFloat(money / maxM * 100).toFixed(1);
		if (numM != aux) {
			numM = aux;
			ns.print(numM + "% grow");
		}
	}
	ns.print(new Date().toString())
	await ns.weaken(server)
}