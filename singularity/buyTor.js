/** @param {NS} ns **/
export async function main(ns) {
	if(ns.purchaseTor()||ns.fileExists("/singularity/player/tor.txt"))
		ns.write("/singularity/player/tor.txt","","w")
}