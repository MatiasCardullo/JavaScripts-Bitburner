/** @param {NS} ns **/
export async function main(ns) {
	if(ns.purchaseTor())
		ns.write("tor.txt","","w")
}