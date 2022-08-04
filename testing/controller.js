import { inputcommands } from "./lib/basicLib.js";

/** @param {NS} ns */
export async function main(ns) {
	//ns.tprint('\n' + ns.read("map.txt"))
	let controllers = navigator.getGamepads()
	//ns.tprint(JSON.stringify(controllers))
	let player = { x: 0, y: 0 }
	let wHeight = 50
	let wLength = 100
	if (controllers[0]) {
		let axes
		let buttons

		while (true) {
			ns.clearLog()
			ns.print(navigator.webdriver)
			controllers = navigator.getGamepads()
			/*controllers[0].vibrationActuator.playEffect('dual-rumble', {
				startDelay: 0,
				duration: 200,
				weakMagnitude: 1.0,
				strongMagnitude: 1.0,
			});*/
			let out = ""
			for (let key in controllers[0]) {
				out += key + ' '
			}
			ns.print(out)
			out = ""
			buttons = controllers[0].buttons
			for (let i in buttons) {
				out += i + ':' + buttons[i].pressed + ' '
			}
			ns.print(out)
			axes = []
			controllers[0].axes.forEach((a) => axes.push(parseInt(a)))
			ns.print(axes)
			if (axes[0] == 0 || axes[1] == 0) {
				player.x += axes[0]
				player.y += axes[1] / 2
			} else {
				player.x += axes[0] / 2
				player.y += axes[1] / 2
			}
			//await navigator.clipboard.readText().then(ns.print);
			let window = "\n".padStart(100 - ns.getScriptName().length, '_')
			for (let y = -(wHeight / 2); y < wHeight / 2; y++) {
				window += '|'
				for (let x = -(wLength / 2); x < wLength / 2; x++) {
					if (parseInt(player.x) == x && parseInt(player.y) == y)
						window += 'O'
					else
						window += ' '
				}
				window += '|\n'
			}
			ns.tprint(window)
			await ns.sleep(0)
		}
	}
}