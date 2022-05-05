import { inputcommands } from "./lib/basicLib.js";

/** @param {NS} ns */
export async function main(ns) {
	ns.tprint('\n' + ns.read("map.txt"))
	inputcommands("ls")
	/*window.addEventListener('gamepadconnected', event => {
		// All buttons and axes values can be accessed through
		const gamepad = event.gamepad;
		ns.tprint(gamepad)
	});
	while (true) {
		await ns.sleep(0)
		//ns.print(Gamepad.toString())
		//ns.print(GamepadEvent.toString())
	}*/
}