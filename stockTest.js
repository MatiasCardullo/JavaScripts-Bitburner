// Built upon u/pwillia7 's stock script.
// u/ferrus_aub stock script using simple portfolio algorithm.
import { runSafeScript, runScript } from "./lib/basicLib.js";

/** @param {NS} ns **/
export async function main(ns) {
    var maxSharePer = 1.00
    var stockBuyPer = 0.60
    var stockVolPer = 0.05
    var moneyKeep = 75000000
    var minSharePer = 5
    var stockAccess = false;
    let onlySell = ns.args[0]
    let access;
    ns.disableLog('sleep');
    ns.disableLog('run');
    ns.disableLog('getServerMoneyAvailable');
    if (onlySell != true) {
        await ns.sleep(15000)
    }
    while (true) {
        access = ns.read("/stock/access.txt")
        if (access == "true,true,true,true") {
            stockAccess = true;
        }
        if (stockAccess) {
            let empty = true;
            let stocks = ns.read("/stock/symbols.txt").split(",")
            if (ns.read("/stock/symbols.txt") == "") {
                await runScript(ns, "/stock/getSymbols.js")
            } else {
                for (let stok of stocks) {
                    try {
                        var position = ns.stock.getPosition(stok);
                    } catch {
                        ns.toast("stockTest:getPosition", 'error')
                        ns.exit()
                    }
                    if (position && position[0]) {
                        empty = false;
                        await sellPositions(stok);
                    }
                    if (!onlySell) {
                        await buyPositions(stok, "Short", position[2]);
                        await buyPositions(stok, "Long", position[0]);
                    }
                }
                if (empty && onlySell) {
                    ns.exit()
                }
                await ns.sleep(1000)
            }
        } else {
            await runSafeScript(ns, "/stock/purchaseWseAccount.js")
            await runSafeScript(ns, "/stock/purchaseTixApi.js")
            await runSafeScript(ns, "/stock/purchase4SMarketData.js")
            await runSafeScript(ns, "/stock/purchase4SMarketDataTixApi.js")
            access = access.split(',')
            access[0] == "false" ? ns.print("Dont have access to Wse Account")
                : access[1] == "false" ? ns.print("Dont have access to Tix Api")
                    : access[2] == "false" ? ns.print("Dont have access to 4S Market Data")
                        : access[3] == "false" ? ns.print("Dont have access to 4S Market Data Tix Api") : null
            ns.exit()
        }
    }

    async function buyPositions(stok, pos, shares) {
        await runSafeScript(ns, "/stock/getMaxShares.js", stok)
        let maxShares = parseFloat(ns.read("/stock/" + stok + "/maxShares.txt")) * maxSharePer - shares
        await runSafeScript(ns, "/stock/getAskPrice.js", stok)
        let askPrice = parseFloat(ns.read("/stock/" + stok + "/price.txt"))
        await runSafeScript(ns, "/stock/getForecast.js", stok)
        let forecast = parseFloat(ns.read("/stock/" + stok + "/forecast.txt"))
        await runSafeScript(ns, "/stock/getVolatility.js", stok)
        let volPer = parseFloat(ns.read("/stock/" + stok + "/volatility.txt"));
        //ns.print(maxSharePer,askPrice,forecast,volPer)
        let playerMoney = ns.getServerMoneyAvailable('home');
        if (forecast >= stockBuyPer && volPer <= stockVolPer) {
            await runSafeScript(ns, "/stock/getPurchaseCost.js", stok, minSharePer, pos)
            if (playerMoney - moneyKeep > parseFloat(ns.read("/stock/" + stok + "/buyCost.txt"))) {
                let buyShares = Math.min((playerMoney/ 2 - moneyKeep - 100000) / askPrice, maxShares);
                if (buyShares != 0) {
                    await runSafeScript(ns, "/stock/buy.js", stok, buyShares)
                    ns.print('Bought ' + stok + ': ' + buyShares)
                }
            }
        }
    }

    async function sellPositions(stok) {
        await runSafeScript(ns, "/stock/getForecast.js", stok)
        let forecast = parseFloat(ns.read("/stock/" + stok + "/forecast.txt"))
        if (forecast < 0.5) {
            await runScript(ns, "/stock/sell.js", stok, position[0])
            ns.print('Sold ' + stok + ': ' + position[0])
            await runScript(ns, "/stock/sell.js", stok, position[2])
            ns.print('Sold ' + stok + ': ' + position[2])
        }
    }
}