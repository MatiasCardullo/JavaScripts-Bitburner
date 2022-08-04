/** @param {NS} ns */
export async function main(ns) {
	if (!ns.singularity.workForFaction(ns.args[0], "hacking", ns.args[1]))
		if (!ns.singularity.workForFaction(ns.args[0], "field", ns.args[1]))
			ns.singularity.workForFaction(ns.args[0], "security", ns.args[1])
}