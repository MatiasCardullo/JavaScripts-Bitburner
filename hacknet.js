/** @param {NS} ns **/
export async function main(ns) {
    for (let h = 0; h < 200; h++) {
        for (let i = 0; i < ns.hacknet.numNodes(); i++) {
            ns.hacknet.upgradeLevel(i, 1)
            ns.hacknet.upgradeRam(i, 1)
            ns.hacknet.upgradeCore(i, 1)
        }
    }
    ns.hacknet.purchaseNode();
}