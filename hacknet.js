/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog('sleep')
    await ns.sleep(100000)
    let cnt;
    if(ns.args[0]!=null)
        cnt = ns.args[0];
    else
        cnt=ns.hacknet.maxNumNodes();
    while (ns.hacknet.numNodes() <= cnt) {
        for (let h = 0; h < 200; h++) {
            for (let i = 0; i < ns.hacknet.numNodes(); i++) {
                ns.hacknet.upgradeLevel(i, 1)
                ns.hacknet.upgradeRam(i, 1)
                ns.hacknet.upgradeCore(i, 1)
            }
        }
        await ns.sleep(0)
        ns.hacknet.purchaseNode();
    }
}