/** @param {NS} ns **/
export async function main(ns) {
	let voices = speechSynthesis.getVoices();
	if (ns.args[0] == null) {
		getLanguages().forEach((e) => {
			ns.tprint(e)
			getVoiceString(e).forEach((v) => ns.tprint(v))
		})
		for (let i = 0; i < voices.length; i++) {
			speak(voices[i].name, i);
		}
	} else {
		speak(ns.args.toString().replaceAll(',', ' '), 15)
	}
}

export function speak(string, voice = 0,pitch=1, rate = 1, volume = 1) {
	let utterance = new SpeechSynthesisUtterance(string);
	utterance.voice = speechSynthesis.getVoices()[voice];
	utterance.pitch = pitch
	utterance.rate = rate
	utterance.volume = volume
	speechSynthesis.speak(utterance);
}

export function getLanguages() {
	let langs = [];
	speechSynthesis.getVoices().forEach((e) => langs.includes(e.lang) ? null : langs.push(e.lang))
	return langs
}

export function getVoiceString(language = null) {
	let voices = []
	let index = 0;
	speechSynthesis.getVoices().forEach(
		function (v) {
			if (language == null || language == v.lang) {
				voices.push(index + ' ' + v.name)
			}
			index++;
		}
	)
	return voices
}