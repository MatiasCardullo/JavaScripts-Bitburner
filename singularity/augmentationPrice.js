/** @param {NS} ns **/
export async function main(ns) {
	let path="/singularity/augments/augsPrice.txt";
	await ns.write(path,"Name,Price,Rep",'w')
	let list=[]
	list=ns.read("/singularity/augments/allAugments.txt").split(',')
	for (let h = 0; h < list.length; h++) {
		if(list[h]!=="")
			await ns.write(path,"\n"+list[h]+','+ns.getAugmentationPrice(list[h])+','+ns.getAugmentationRepReq(list[h]),'a')
	}
}