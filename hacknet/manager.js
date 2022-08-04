/** @param {NS} ns **/
export async function main(ns) {
    let showToast; let toastTime = 5000;
    let lastCount; let count;
    let augs = ns.read("/augments/installed.txt")
    let stnk = !augs.includes("Stanek's Gift - Genesis") || augs.includes("Stanek's Gift - Serenity")
    let min = ns.read("/augments/minPrice.txt")
    if (min != "" && min != "null")
        showToast = true
    //ns.hacknet.getHashUpgrades().forEach((u) => ns.hacknet.spendHashes(u))
    ns.hacknet.spendHashes("Exchange for Bladeburner SP")
    while (ns.hacknet.spendHashes("Sell for Money")) { }
    count = ns.hacknet.numNodes()
    if (count != lastCount) {
        await ns.write("/hacknet/count.txt", count, 'w')
        lastCount = count
    }
    let indexs = []
    let nodes = []
    for (let i = 0; i < count; i++) {
        nodes.push(ns.hacknet.getNodeStats(i))
        indexs.push(i)
    }
    await ns.write("/hacknet/nodes.txt", JSON.stringify(nodes, null, '\t'), 'w')
    indexs.sort((a, b) => Math.random() - 0.5)
    //ns.tprint(indexs)
    let cache
    //ns.tprint(JSON.stringify(ns.hacknet.getNodeStats(0)))
    let purchCost
    for (let i of indexs) {
        if (stnk && ns.hacknet.getLevelUpgradeCost(i, 1) < money())
            if (ns.hacknet.upgradeLevel(i, 1) && showToast)
                ns.toast("Hacknet " + i + " Level upgraded", "success", 1000)
        if (stnk) {
            purchCost = money()
        } else {
            purchCost = ns.getServerMoneyAvailable("home")
        }
        if (ns.hacknet.getRamUpgradeCost(i, 1) < purchCost)
            if (ns.hacknet.upgradeRam(i, 1) && showToast)
                ns.toast("Hacknet " + i + " RAM upgraded", "success", toastTime)
        if (stnk && ns.hacknet.getCoreUpgradeCost(i, 1) < money())
            if (ns.hacknet.upgradeCore(i, 1) && showToast)
                ns.toast("Hacknet " + i + " Core upgraded", "success", toastTime)
        cache = ns.hacknet.getCacheUpgradeCost(i, 1)
        if (stnk && cache < money())
            if (ns.hacknet.upgradeCache(i, 1) && showToast)
                ns.toast("Hacknet " + i + " Cache upgraded", "success", toastTime)
    }
    if (cache == Infinity || ns.hacknet.getPurchaseNodeCost() < purchCost || count == 0)
        if (ns.hacknet.purchaseNode() != -1 && showToast)
            ns.toast("Hacknet purchased", "success", toastTime * 2)

    function money() {
        let money = ns.getServerMoneyAvailable("home")
        if (min != "" && min != "null")
            money -= (parseInt(min) * 3)
        return money
    }
}