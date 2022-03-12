/** @param {NS} ns **/
export async function main(ns) {
	let server=ns.args[0];
	let level=ns.args[1];
	let minL=ns.args[2];
	while(minL<level){
		level-=await ns.weaken(server)
	}
}