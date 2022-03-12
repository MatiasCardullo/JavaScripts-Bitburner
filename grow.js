/** @param {NS} ns **/
export async function main(ns) {
	let server=ns.args[0];
	let money=ns.args[1];
	let maxM=ns.args[2];
	while(money<maxM){
		money*=(1+ await ns.grow(server,{stock:true}))
	}
}