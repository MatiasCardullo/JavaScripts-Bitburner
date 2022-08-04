/** @param {NS} ns */
export async function main(ns) {
	ns.clearLog()
	let output = ""
	let augmentationNames = await keyNames()
	for (let name in augmentationNames) {
		output += '\n' + name + ": " + augmentationNames[name]
	}
	let data = await augData()
	for (let name in data) {
		output += '\n\n' + name + ":"
		for (let key in data[name]) {
			output += '\n' + key + ": " + data[name][key]
		}
	}
	ns.print(output)

	async function augData() {
		let augmentationInfo = {}
		let file = ns.read("/augments/data.txt")
		if (file == "") {
			await ns.wget("https://raw.githubusercontent.com/danielyxie/bitburner/dev/src/Augmentation/data/AugmentationCreator.tsx", "/augments/data.txt")
			file = ns.read("/augments/data.txt").replaceAll('\n', '').replaceAll('	', '').replaceAll('      ', '').split('name: AugmentationNames.')
			for (let key of file) {
				let name = key.slice(0, key.indexOf(","))
				if (name != "") {
					if (key.includes("${FactionNames.")) {
						let start = key.indexOf("${FactionNames.")
						let mid = key.indexOf('.', start)
						let end = key.indexOf('}', start)
						key = key.slice(0, start) + key.slice(mid + 1, end) + key.slice(end + 1)
					}
					let stats = key.slice(key.indexOf("stats:")).replace("stats: ", "")
					stats = stats.slice(0, stats.indexOf(":"))
					let info = key.slice(key.indexOf("info:")).replace("info:", "")
					let end = info.indexOf(":")
					if (name == "CongruityImplant")
						end = info.indexOf(":", end + 1)
					info = info.slice(0, end)
					if (stats == "" && info == "") {
						//ns.toast(name, "error", null)
					} else {
						if (stats != "" && !stats.includes("null,")) {
							if (name == "NeuroFluxGovernor")
								stats = stats.replace("+{(donationBonus * 100).toFixed(6)}% ", '')
							stats = stats.slice(stats.indexOf('>') + 1, stats.lastIndexOf('<'))
						} else {
							stats = null
						}
						if (info != "") {
							if (name == "CongruityImplant" || name == "CashRoot") {
								if (name == "CongruityImplant")
									info = info.replaceAll("<br />", "").replace("<b>", "").replace("</b>", "").replace("<code>", "").replace("</code>", "")
								info = info.slice(info.indexOf('>') + 1, info.lastIndexOf('<'))
							} else {
								let aux = ""
								info = info.slice(0, info.lastIndexOf(","))
								if (name == "StaneksGift1")
									info = info.replace('"Mother"', "Mother").replaceAll("'", '"')
								info.split(/"|`/).forEach((l) => l.includes('+') ? null : aux += l.replace("Mother", '"Mother"'))
								info = aux
							}
						} else {
							info = null
						}
						augmentationInfo[name] = { ["stats"]: stats, ["info"]: info }
					}
				}
			}
			await ns.write("/augments/data.txt", JSON.stringify(augmentationInfo, null, '\t'), 'w')
		} else {
			augmentationInfo = JSON.parse(file)
		}
		return augmentationInfo
	}

	async function keyNames() {
		let augmentationNames = {}
		let file = ns.read("/augments/names.txt")
		if (file == "") {
			await ns.wget("https://raw.githubusercontent.com/danielyxie/bitburner/dev/src/Augmentation/data/AugmentationNames.ts", "/augments/names.txt")
			file = ns.read("/augments/names.txt")
			file = file.replace("export enum AugmentationNames ", "").split('\n')
			for (let line of file) {
				ns.print(line)
				if (line.includes('=')) {
					let key = line.split(' ')[2]
					let name = line.split(' = ')[1].split(',')[0].replaceAll('"', '')
					augmentationNames[name] = key
				}
			}
			await ns.write("/augments/names.txt", JSON.stringify(augmentationNames, null, '\t'), 'w')
		} else {
			augmentationNames = JSON.parse(file)
		}
		return augmentationNames
	}
}