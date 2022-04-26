/** @param {NS} ns */
export async function main(ns) {
	ns.tprint(asd())
	ns.tprint(asd.toPrint())
	
	function asd() {
		return ["asd", "qwe", "zxc"]
	}

	asd.prototype.toPrint = function () {
		return asd().toString().replace(',', '\n')
	}
}