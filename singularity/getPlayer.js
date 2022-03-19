/** @param {NS} ns **/
export async function main(ns) {
	let path="/singularity/player/playerStats.txt"
	let data=ns.getPlayer()
	let output="";
	for (var key in data) {
		if(output!="")
			output+=','
		output+=key+':'+data[key];
	}
	await ns.write(path,output,'w')
}