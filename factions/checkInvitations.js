/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/factions/invitations.txt",ns.singularity.checkFactionInvitations(),'w')
}