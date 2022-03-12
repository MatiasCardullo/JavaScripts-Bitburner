/** @param {NS} ns **/
export async function main(ns) {
	await youtubeMP3(ns,"https://www.youtube.com/watch?v=4nGKbRNSnsg")
}

/** @param {NS} ns **/
export async function youtubeMP3(ns,link){
	let realLink; let fileName;
	let key=link.split('=')[1];
	//ns.print(key)
	await ns.wget(link,"YouTube"+key+".txt")
	let file=ns.read("YouTube"+key+".txt")
	ns.rm("YouTube"+key+".txt")
	file = file.split('\r\n')
	for (let j = 0; j < file.length; j++){
		let aux=file[j].search("audio/mp4")
		//ns.print(file[j]);
		if(aux!==-1){
			let indexF =file[j].indexOf(",\"mimeType\":\"audio/mp4")
			//ns.print(aux);await ns.sleep(5000)
			aux=file[j].slice(0,indexF)
			//ns.print(aux);await ns.sleep(5000)
			let indexI=aux.lastIndexOf("https://")
			realLink=aux.slice(indexI,aux.length-1)
			//ns.print(aux);await ns.sleep(5000)
		}
	}
	return realLink;
}