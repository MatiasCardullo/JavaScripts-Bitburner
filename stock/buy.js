/** @param {NS} ns **/
export async function main(ns) {
	let path="";let file="";
	let price=ns.stock.buy(ns.args[0], ns.args[1]);
	if(price>0){
		path="/stock/"+ns.args[0]+"/myShares.txt"
		file=ns.read(path)
		if(file=="")
			await ns.write(path,ns.args[1],'w')
		else{
			await ns.write(path,parseInt(file)+ns.args[1],'w')
		}
		path="/stock/"+ns.args[0]+"/invested.txt"
		file=ns.read(path)
		if(file=="")
			await ns.write(path,0-price*ns.args[1],'w')
		else{
			await ns.write(path,parseInt(file)-price*ns.args[1],'w')
		}
	}
}