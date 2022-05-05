/** @param {NS} ns **/
export async function main(ns) {
	if(ns.singularity.purchaseTor()){
		ns.toast("Purchased TOR router")
	}
}