/** @param {NS} ns **/
export async function main(ns) {
	let voices=speechSynthesis.getVoices();
	for (let i = 0; i < voices.length; i++) {
		ns.tprint(voices[i].name+" "+voices[i].lang)
		var utterance  = new SpeechSynthesisUtterance("Hola que tal");
		utterance.voice=voices[i]
		speechSynthesis.speak(utterance);
	}
}