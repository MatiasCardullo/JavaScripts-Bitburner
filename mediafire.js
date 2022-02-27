/** @param {NS} ns **/
export async function main(ns) {
	for (let i = 0; i < ns.args.length; i++){
		let realLink=await mediafire(ns,ns.args[i])
		let fileName=realLink.split('/')[5]
		//ns.print(realLink+" "+fileName);
		if (!(fileName.endsWith(".script")||fileName.endsWith(".js")||fileName.endsWith(".ns")||fileName.endsWith(".txt")))
			fileName+=".txt";
		if(await ns.wget(realLink,fileName))
			ns.tprint(fileName+" downloaded successfully");
		else
			ns.tprint(fileName+" failed to download");
	}
}

/** @param {NS} ns **/
export async function mediafire(ns,link){
	let realLink; let fileName;
	let key=link.split('/')[4];
	await ns.wget(link,"Mediafire"+key+".txt")
	let file=ns.read("Mediafire"+key+".txt")
	ns.rm("Mediafire"+key+".txt")
	file = file.split('\r\n')
	for (let j = 0; j < file.length; j++){
		let aux=file[j].search("https://download")
		//ns.print(file[j]);
		if(aux!==-1){
			aux=file[j].slice(aux);
			//ns.print(aux);
			realLink=aux.slice(0,aux.search('"'));
		}
	}
	return realLink;
}