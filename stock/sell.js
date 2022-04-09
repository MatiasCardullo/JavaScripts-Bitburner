/** @param {NS} ns **/
export async function main(ns) {
	let path;let file;let aux=0; let notif='StockMarket: Sold '
	let price = ns.stock.sell(ns.args[0], ns.args[1]);
	if(price>0){
		notif+=ns.nFormat(price * ns.args[1], '0a')
		notif=notif.padEnd(30)+' from '+ns.args[0]
		notif=notif.padEnd(45)
		ns.toast(notif, 'success', 600000)
		path="/stock/"+ns.args[0]+"/myShares.txt"
		file=ns.read(path)
		if(parseInt(file)>ns.args[1])
			aux=parseInt(file)-ns.args[1]
		await ns.write(path,aux,'w')
		path="/stock/"+ns.args[0]+"/invested.txt"
		file=ns.read(path)
		await ns.write(path,parseInt(file)+price*ns.args[1],'w')
	}
}