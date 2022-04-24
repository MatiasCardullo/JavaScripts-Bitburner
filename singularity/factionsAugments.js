/** @param {NS} ns **/
export async function main(ns) {
	let faction = ns.args[0];
	let path = "/factions/" + faction.replaceAll(' ', '').replace('&', 'And') + "/augments.txt"
	let aux = []; let aux2 = [];
	aux = ns.getAugmentationsFromFaction(faction);
	await ns.write(path, aux, 'w')
	let writein = false
	let file = ns.read("/augments/allAugments.txt")
	if (file != "") {
		aux2 = file.split(',')
	}
	for (let h = 0; h < aux.length; h++) {
		if (!file.includes(aux[h])) {
			writein = true
			aux2.push(aux[h])
		}
	}
	if (writein)
		await ns.write("/augments/allAugments.txt", aux2, 'w')
}