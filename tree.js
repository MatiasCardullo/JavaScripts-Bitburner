/** @param {NS} ns **/
export async function main(ns) {
	let aux;
	let array=[];
	let printed="";
	switch (ns.args[0]) {
		case "home":
			aux=ns.ls("home",ns.args[1])
			printed=aux.toString().replaceAll(',','\n')
			aux.forEach((e)=>e=e.split('/'))
			break;
	}
	ns.tprint(printed)
	/*let path="";let path2="";let output="";let deep;
	for (let f = 0; f < aux.length; f++) {
		output=""
		deep=0;
		aux[f].forEach(function(e){
			if(!path.includes(e)){
				if(path!="")
					path+='/'
				path+=e
				for (let g = 0; g < deep-1; g++) {
					output+=' |'
				}
				if(deep>0){
					output[output.length-1]='└'
				}
				output+=e+'\n';
			}
			deep++
		})
		ns.tprint(output)
	}*/
}