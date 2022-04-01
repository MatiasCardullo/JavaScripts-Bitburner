/** @param {NS} ns **/
export async function main(ns) {
	let doc="";
	
	eval('doc=document.getElementById("terminal")')
	ns.clearLog()
	//ns.print("\n"+doc.innerText)
	//ns.print("\n"+doc.outerText)
	ns.print("\n"+doc.innerHTML)
	ns.print("\n"+doc.outerHTML)
	doc.innerHTML=doc.innerHTML.replace('[home ~/]&gt; a','[home ~/]&gt; s')
	doc.outerHTML=doc.outerHTML.replace('[home ~/]&gt; a','[home ~/]&gt; s')
	//ns.write("doc.txt",doc,'w')
	//let data=objectToString(doc);
	//ns.print(data[0])
	//ns.print(data[1])
	//files("/doc/","doc",data)
}

function objectToString(input){
	let output=""
	let outputArray=[]
	for(let key in input){
		let value=""
		if(input[key]!=null)
			value=input[key].toString()
		output+=key+':'+input[key]+'\n'
		if(value.startsWith("[object")){
			outputArray.push([key,input[key]]) 
		}
	}
	return [output,outputArray];
}

/*function files(path,name,data){
	let output=[];
	await ns.write(path+name+".txt",data[0])
	for(let i in data[1]){
		try{
			object=objectToString(data[1][i][1])
			output.concat(object[1])
			await ns.write("/doc/"+data[1][i][0].replace('$','')+".txt",'\n'+object[0])
			output.push(object[1])
		}
		catch{
			ns.tprint(data[1][i][0])
		}
	}
	return output;
}*/