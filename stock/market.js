// Built upon u/pwillia7 's stock script.
// u/ferrus_aub stock script using simple portfolio algorithm.
import { runSafeScript, runScript } from "./lib/basicLib.js";

/** @param {NS} ns **/
export async function main(ns) {
    var maxSharePer = 1.00
    var stockBuyPer = 0.60
    var stockVolPer = 0.05
    var moneyMin; var moneyMax;
    var minSharePer = 5
    let onlySell = ns.args[0]
    let p;
    ns.disableLog('sleep');
    ns.disableLog('run');
    ns.disableLog('getServerMoneyAvailable');
    if (onlySell != true) {
        await ns.sleep(15000)
    }
    while (true) {
        await runSafeScript(ns, "/singularity/getPlayer.js")
        p = ns.read("/logs/playerStats.txt")
        if (p.hasWseAccount && p.hasTixApiAccess && p.has4SData && p.has4SDataTixApi) {
            moneyMin = 200000000
            moneyMax = parseFloat(ns.read("/logs/minPrice.txt"))
            let empty = true;
            let stocks = ns.read("/stock/symbols.txt").split(',')
            if (ns.read("/stock/symbols.txt") == "") {
                await runScript(ns, "/stock/getSymbols.js")
            } else {
                for (let stok of stocks) {
                    try {
                        var position = ns.stock.getPosition(stok);
                        if (position && position[0]) {
                            empty = false;
                            await sellPositions(stok);
                        }
                        if (!onlySell) {
                            await buyPositions(stok, "Short", position[2]);
                            await buyPositions(stok, "Long", position[0]);
                        }

                    } catch {
                        ns.toast("stockTest:getPosition", 'error')
                        ns.exit()
                    }
                }
                if (empty && onlySell) {
                    ns.exit()
                }
                await ns.sleep(1000)
            }
        } else {
            if (!p.hasWseAccount) {
                await runScript(ns, "/stock/purchaseWseAccount.js")
                ns.print("Dont have access to Wse Account")
            } else if (!p.hasTixApiAccess) {
                await runScript(ns, "/stock/purchaseTixApi.js")
                ns.print("Dont have access to Tix Api")
            } else if (!p.has4SData) {
                await runScript(ns, "/stock/purchase4SMarketData.js")
                ns.print("Dont have access to 4S Market Data")
            } else {
                await runScript(ns, "/stock/purchase4SMarketDataTixApi.js")
                ns.print("Dont have access to 4S Market Data Tix Api")
            }
            ns.exit()
        }
    }

    async function buyPositions(stok, pos, shares) {
        await runScript(ns, "/stock/getMaxShares.js", stok)
        await runScript(ns, "/stock/getAskPrice.js", stok)
        await runScript(ns, "/stock/getForecast.js", stok)
        await runScript(ns, "/stock/getVolatility.js", stok)
        let maxShares = parseFloat(ns.read("/stock/" + stok + "/maxShares.txt")) * maxSharePer - shares
        let askPrice = parseFloat(ns.read("/stock/" + stok + "/price.txt"))
        let forecast = parseFloat(ns.read("/stock/" + stok + "/forecast.txt"))
        let volPer = parseFloat(ns.read("/stock/" + stok + "/volatility.txt"));
        //ns.print(maxSharePer,askPrice,forecast,volPer)
        let playerMoney = ns.getServerMoneyAvailable('home');
        if (forecast >= stockBuyPer && volPer <= stockVolPer) {
            await runSafeScript(ns, "/stock/getPurchaseCost.js", stok, minSharePer, pos)
            if (playerMoney - moneyMax > parseFloat(ns.read("/stock/" + stok + "/buyCost.txt"))) {
                let buyShares = Math.min((playerMoney - moneyMin - 100000) / askPrice, maxShares);
                if (buyShares != 0) {
                    await runScript(ns, "/stock/buy.js", stok, buyShares)
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