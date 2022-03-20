/** @param {NS} ns **/
export async function main(ns) {
	let voices = speechSynthesis.getVoices();
	getLanguages().forEach((e)=>{
		ns.tprint(e)
		getVoice(e).forEach((v)=>ns.tprint(v))
	})
	for (let i = 0; i < voices.length; i++) {
		var utterance = new SpeechSynthesisUtterance(voices[i].name);
		utterance.voice = voices[i]
		speechSynthesis.speak(utterance);
	}
}

export function speak(string,voice=0) {
	let utterance = new SpeechSynthesisUtterance(string);
	utterance.voice = speechSynthesis.getVoices()[voice];
	speechSynthesis.speak(utterance);
}

export function getLanguages(){
	let langs=[];
	speechSynthesis.getVoices().forEach((e)=>langs.includes(e.lang)?null:langs.push(e.lang))
	return langs
}

export function getVoice(language=null){
	let voices=[]
	let index=0;
	speechSynthesis.getVoices().forEach(
		function (v) {
			if(language==null||language==v.lang){
				voices.push(index+' '+v.name)
			}
			index++;
		}
	)
	return voices
}