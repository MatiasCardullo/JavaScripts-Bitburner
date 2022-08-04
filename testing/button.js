/** @param {NS} ns */
export async function main(ns) {
	let button = '<Button onClick={click()}>Hola</Button>'
	ns.alert(button)

	function click() {
		console.log("click")
	}
}