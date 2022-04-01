import { getInput, setInput } from "./lib/basicLib.js";

/** @param {NS} ns **/
export async function main(ns) {
	let string="";
	while(true){
		string=getInput()
		if(string&&string.includes(':')){
			string.split(':').forEach(function(e){
				if(e.startsWith('U+')){
					let char=e.slice(2)
					if(char.length==4){
						let index=string.indexOf(e);
						char=String.fromCharCode(parseInt(char,16))
						setInput(string.slice(0,index-1)+char+string.slice(index+6))
					}
				}
			})
		}
		await ns.sleep(100)
	}
}