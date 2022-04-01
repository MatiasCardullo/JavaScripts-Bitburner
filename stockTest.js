// Built upon u/pwillia7 's stock script.
// u/ferrus_aub stock script using simple portfolio algorithm.
import { runSafeScript } from "./lib/basicLib.js";

/** @param {NS} ns **/
export async function main(ns) {
    var maxSharePer = 1.00
    var stockBuyPer = 0.60
    var stockVolPer = 0.05
    var moneyKeep = 1000000
    var minSharePer = 5
    var stockAccess = false;
    let onlySell = ns.args[0]
    let access;
    ns.disableLog('sleep');
    ns.disableLog('run');
    ns.disableLog('getServerMoneyAvailable');
    ns.disableLog('stock.purchase4SMarketData');
    ns.disableLog('stock.purchase4SMarketDataTixApi');
    if(onlySell!=true){
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
            if (stocks >1) {
                await runSafeScript(ns, "/stock/getSymbols.js")
            } else {
                for (let stok of stocks) {
                    var position = ns.stock.getPosition(stok);
                    if (position[0]) {
                        empty = false;
                        await sellPositions(stok);
                    }
                    if (!onlySell)
                        await buyPositions(stok);
                }
                if (empty && onlySell) {
                    ns.exit()
                }
                await ns.sleep(0)
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

    async function buyPositions(stok) {
        await runSafeScript(ns, "/stock/getMaxShares.js", stok)
        let maxShares = parseFloat(ns.read("/stock/" + stok + "/maxShares.txt")) * maxSharePer - position[0]
        await runSafeScript(ns, "/stock/getAskPrice.js", stok)
        let askPrice = parseFloat(ns.read("/stock/" + stok + "/price.txt"))
        await runSafeScript(ns, "/stock/getForecast.js", stok)
        let forecast = parseFloat(ns.read("/stock/" + stok + "/forecast.txt"))
        await runSafeScript(ns, "/stock/getVolatility.js", stok)
        let volPer = parseFloat(ns.read("/stock/" + stok + "/volatility.txt"));
        //ns.print(maxSharePer,askPrice,forecast,volPer)
        let playerMoney = ns.getServerMoneyAvailable('home');
        if (forecast >= stockBuyPer && volPer <= stockVolPer) {
            if (playerMoney - moneyKeep > ns.stock.getPurchaseCost(stok, minSharePer, "Long")) {
                let shares = Math.min((playerMoney - moneyKeep - 100000) / askPrice, maxShares);
                if (shares != 0) {
                    await runSafeScript(ns, "/stock/buy.js", stok, shares)
                    ns.print('Bought ' + stok + ': ' + shares)
                }
            }
        }
    }

    async function sellPositions(stok) {
        await runSafeScript(ns, "/stock/getForecast.js", stok)
        let forecast = parseFloat(ns.read("/stock/" + stok + "/forecast.txt"))
        if (forecast < 0.5) {
            ns.run("/stock/sell.js", 1, stok, position[0])
            ns.print('Sold ' + stok + ': ' + position[0])
        }
    }
}