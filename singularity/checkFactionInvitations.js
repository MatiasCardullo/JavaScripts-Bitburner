/** @param {NS} ns */
export async function main(ns) {
	await ns.write("/singularity/player/invitations.txt",ns.checkFactionInvitations(),'w')
}