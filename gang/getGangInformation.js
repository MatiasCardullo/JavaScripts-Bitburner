/** @param {NS} ns */
export async function main(ns) {
	let data = ns.gang.getGangInformation()
	for (var key in data) {
		await ns.write("/gang/info/"+key+".txt",data[key],'w')
	}
}