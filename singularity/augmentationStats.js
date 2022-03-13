/** @param {NS} ns **/
export async function main(ns) {
	let augment=ns.args[0];
	let path="/singularity/augments/"+augment.replaceAll(' ','').replace("'",'').replace("(S.N.A)","")+".txt"
	let data=ns.getAugmentationStats(augment)
	let output="";
	for (var key in data) {
		if(output!="")
			output+=','
		output+=key+':'+data[key];
	}
	await ns.write(path,output,'w')
}