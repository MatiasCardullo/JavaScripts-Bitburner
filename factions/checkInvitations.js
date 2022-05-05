/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/logs/invitations.txt",ns.singularity.checkFactionInvitations(),'w')
}