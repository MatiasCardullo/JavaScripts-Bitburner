/** @param {NS} ns **/
export async function main(ns) {
	let augment = ns.args[0];
	let keyNames = JSON.parse(ns.read("/augments/names.txt"))
	let extraData = JSON.parse(ns.read("/augments/data.txt"))
	if (augment != "") {
		let key = keyNames[augment]
		let path = "/augments/data/" + key + ".txt";
		//let path = "/augments/data/" + augment.replaceAll(' ', '').replace("'", '').replace(":", '').replace("(S.N.A)", "") + ".txt"
		try {
			let data = ns.singularity.getAugmentationStats(augment)
			if (extraData[key] != null) {
				if (extraData[key].info != null)
					data.info = extraData[key].info
				if (extraData[key].stats != null)
					data.stats = extraData[key].stats
			} else
				ns.toast("No extra data from " + augment, "warning", null)
			await ns.write(path, JSON.stringify(data, null, '	'), 'w')
		} catch { ns.toast(ns.getScriptName() + ": Error with " + augment, "error", null) }
	}
}