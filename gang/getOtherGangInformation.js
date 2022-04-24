/** @param {NS} ns */
export async function main(ns) {
	let data = ns.gang.getOtherGangInformation();
	for (let key in data) {
		data[key].chance=0;
	}
	await ns.write("/gang/otherGangs.txt",JSON.stringify(data),'w');
}