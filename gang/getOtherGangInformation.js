/** @param {NS} ns */
export async function main(ns) {
	let data = ns.gang.getOtherGangInformation();
	let output=[];
	for (var key in data) {
		output.push(key);
		for (var key2 in data[key]) {
			await ns.write("/gang/allGangs/"+key.replaceAll(' ','')+'/'+key2+".txt",data[key][key2],'w');
		}
	}
	await ns.write("/gang/allGangs/names.txt",output,'w');
}