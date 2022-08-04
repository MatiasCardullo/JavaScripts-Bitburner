/** @param {NS} ns */
export async function main(ns) {
	//if(Math.random()>0.99)
	//ns.tail()
	try {
		await ns.stanek.chargeFragment(ns.args[0], ns.args[1])
	} catch { }
}