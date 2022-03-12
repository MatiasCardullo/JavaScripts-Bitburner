/** @param {NS} ns **/
export async function main(ns) {
	let server=ns.args[0];
	let t=new Date();
	let output=t.getTime()+':'+await ns.hack(server,{stock:true});
	while(money<maxM){
		output+=','+t.getTime()+':'+await ns.hack(server,{stock:true});
		ns.write(server+'_log',output,'a');
	}
}