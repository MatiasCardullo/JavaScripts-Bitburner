import { _chargeSound } from "./sounds/chargeSound.js"
/** @param {NS} ns **/
export async function main(ns) {

  var audio = new Audio("data:audio/wav;base64," + _chargeSound);
  var context = new AudioContext();
  var src = context.createMediaElementSource(audio);
  var analyser = context.createAnalyser();
  src.connect(analyser);
  analyser.connect(context.destination);
  analyser.fftSize = 128;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);
  audio.play()
  while (true) {
    ns.clearLog();
    asd();
    await ns.sleep(0);
  }

  function asd() {
    let output = "";
    let mult=0.4;
    analyser.getByteFrequencyData(dataArray);
    for (var i = 0; i < bufferLength; i++) {
      output="";
      for (var j = 0; j < dataArray[i]*mult; j++) {
        output += '█';
      }
      mult+=0.1;
      ns.print(output);
    }

  }
}