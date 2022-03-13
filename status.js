/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('ALL')
	var servers = ["home"];
	for (let i = 0; i < servers.length; i++) {
		var thisScan = ns.scan(servers[i]);
		for (let j = 0; j < thisScan.length; j++) {
			if (servers.indexOf(thisScan[j]) === -1) {
				servers.push(thisScan[j]);
				let aux=ns.ls(thisScan[j],".cct")
				let line;
				if(aux.length>0){
					line=thisScan[j]+": ";
					for (let k = 0; k < aux.length; k++)
						line+=aux[k]+"-"+ns.codingcontract.getContractType(aux[k],thisScan[j])+"-"+ns.codingcontract.getData(aux[k],thisScan[j])+" ";
					ns.tprint(line);
				}
			}
		}
	}
	servers.splice(0, 1);
	//ns.tprint(servers);

	/*while(true){
		for (let i = 0; i < servers.length; i++) {
			var maxM=ns.getServerMaxMoney(servers[i]);
			if(ns.hasRootAccess(servers[i])&&maxM>0){
				var output=""; var lenghtConsole=140; var perc;
				var minL=ns.getServerMinSecurityLevel(servers[i]);
				var money=ns.getServerMoneyAvailable(servers[i]);
				var security=ns.getServerSecurityLevel(servers[i]);
				if(maxM!=money){
					output+=" Growing "+servers[i];
					perc=parseFloat(money / maxM * 100).toFixed(2);
				}else if(minL!=security){
					output+="  Weaken "+servers[i];
					perc=parseFloat(minL / security * 100).toFixed(2);
				}else{
					output+=" Hacking "+servers[i];
					perc=100;
				}
				if(perc!=0){
					var aux=perc;
					for (let j = output.length; j < 35; j++)
						output+="_";
					output+="[";
					for (let j = 0; j < 100; j++) {
						if(aux>=1){
							output+="█";aux--;
						}else{
							output+="-";
						}
					}
					output+="]"+perc.toString()+"%";
				}
				ns.print(output);
			}
		}
		await ns.sleep(10);
		ns.clearLog();
	}*/
}