// Built upon u/pwillia7 's stock script.
// u/ferrus_aub stock script using simple portfolio algorithm.
import { runSafeScript, runScript } from "./lib/basicLib.js";
import { speak } from "./sounds/voice.js";

/** @param {NS} ns **/
export async function main(ns) {
    var maxSharePer = 1.00
    var stockBuyPer = 0.60
    var stockVolPer = 0.05
    var moneyMin; var moneyMax; let p;
    let access = [false, false, false, false];
    var minSharePer = 5
    let onlySell = ns.args[0]
    let itSell = false
    ns.disableLog('sleep');
    ns.disableLog('run');
    ns.disableLog('getServerMoneyAvailable');
    while (true) {
        await runSafeScript(ns, "getPlayer.js")
        p = JSON.parse(ns.read("/logs/playerStats.txt"))
        /*"hasWseAccount": true,
        "hasTixApiAccess": true,
        "has4SData": true,
        "has4SDataTixApi": true,*/
        access = [p.hasWseAccount, p.hasTixApiAccess, p.has4SData, p.has4SDataTixApi]
        //ns.tprint(access)
        if (access.toString() == "true,true,true,true") {
            moneyMin = parseFloat(ns.read("/augments/minPrice.txt"))
            moneyMax = moneyMin * (1 + ns.read("/augments/purchased.txt").split(',').length)
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
                if (itSell)
                    itSell = false
                if (empty && onlySell) {
                    ns.exit()
                }
                await ns.sleep(1000)
            }
        } else {
            if (access[0] !== true) {
                await runScript(ns, "/stock/purchaseWseAccount.js")
                ns.print("Dont have access to Wse Account")
            }
            if (access[1] !== true) {
                await runScript(ns, "/stock/purchaseTixApi.js")
                ns.print("Dont have access to Tix Api")
            }
            if (access[2] !== true) {
                await runScript(ns, "/stock/purchase4SMarketData.js")
                ns.print("Dont have access to 4S Market Data")
            }
            if (access[3] !== true) {
                await runScript(ns, "/stock/purchase4SMarketDataTixApi.js")
                ns.print("Dont have access to 4S Market Data Tix Api")
            }
            ns.exit()
        }

        async function buyPositions(stok, pos, shares) {
            await runScript(ns, "/stock/getMaxShares.js", stok)
            await runScript(ns, "/stock/getAskPrice.js", stok)
            await runScript(ns, "/stock/getForecast.js", stok)
            await runSafeScript(ns, "/stock/getVolatility.js", stok)
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
                if (!itSell)
                    speak("StockMarket", 11)
                itSell = true
                await runScript(ns, "/stock/sell.js", stok, position[0])
                ns.print('Sold ' + stok + ': ' + position[0])
                await runScript(ns, "/stock/sell.js", stok, position[2])
                ns.print('Sold ' + stok + ': ' + position[2])
            }
        }
    }
}