/** @param {NS} ns **/
export async function main(ns) {
	let faction = ns.args[0];
	let path = "/singularity/factions/" + faction.replaceAll(' ', '').replace('&', 'And') + "Augments.txt"
	let aux = []; let aux2 = [];
	aux = ns.getAugmentationsFromFaction(faction);
	await ns.write(path, aux, 'w')
	let output = ""
	let file=ns.read("/singularity/augments/allAugments.txt")
	if (file!="") {
		aux2 = file.split(',')
		output=','
	}
	for (let h = 0; h < aux.length; h++) {
		if (!aux2.includes(aux[h])){
			output += aux[h];
			if(h<aux.length-1){
				output += ','
			}
		}
	}
	await ns.write("/singularity/augments/allAugments.txt", output, 'a')
}