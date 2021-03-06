/** @param {NS} ns **/
export async function main(ns) {
	let augment = ns.args[0];
	let path = "/augments/" + augment.replaceAll(' ', '').replace("'", '').replace(":", '').replace("(S.N.A)", "") + ".txt"
	try {
		let data = ns.singularity.getAugmentationStats(augment)
		await ns.write(path, JSON.stringify(data), 'w')
	} catch { }
}