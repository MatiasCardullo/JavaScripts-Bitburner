/** @param {NS} ns */
export async function main(ns) {
	let name=ns.args[0].slice(0,ns.args[0].length-4).replace('&','And')
	await ns.write("/cct/files/"+name+"/description.txt",JSON.stringify(ns.codingcontract.getDescription(ns.args[0],ns.args[1])),'w')
}