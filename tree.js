/** @param {NS} ns **/
export async function main(ns) {
	let list;
	let dir = [];
	let printed = "";
	switch (ns.args[0]) {
		case "home":
			list = ns.ls("home", ns.args[1])
			list.forEach(function (e) {
				let prin=false
				let aux = e.split('/')
				if (aux.length > 2)
					aux.forEach(function (e) {
						if(e != ""){
							if(!dir.includes(e)){
								//print
								dir.push(e)
							}
						}
					})
				printed += '\n' + e//aux.toString()
			})
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