/** @param {NS} ns **/
export async function main(ns) {
	ns.singularity.donateToFaction(ns.args[0],ns.args[1])?ns.toast(`Donated ${ns.nFormat(ns.args[1],'0a')} to ${ns.args[0]}`,'success'):null
}