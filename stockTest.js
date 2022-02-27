// Built upon u/pwillia7 's stock script.
// u/ferrus_aub stock script using simple portfolio algorithm.
/** @param {NS} ns **/
export async function main(ns) {
    var maxSharePer = 1.00
    var stockBuyPer = 0.60
    var stockVolPer = 0.05
    var moneyKeep = 1000000000
    var minSharePer = 5
    var stockAccess=false;
    ns.disableLog('ALL');
    ns.disableLog('ALL');
    ns.disableLog('ALL');

    while (true) {
        try{
            stockAccess=ns.stock.purchase4SMarketData()&&ns.stock.purchase4SMarketDataTixApi()
        }catch{
            ns.print("Dont have enough money for purchase4SMarketDataTixApi or/and purchase4SMarketData")
        }
        if(stockAccess){
            var stocks = ns.stock.getSymbols()
            for (const stock of stocks) {
                var position = ns.stock.getPosition(stock);
                if (position[0]) {
                    sellPositions(stock);
                }
                buyPositions(stock);
            }
        }
        await ns.sleep(1000);
    }

    function buyPositions(stock) {
        var maxShares = (ns.stock.getMaxShares(stock) * maxSharePer) - position[0];
        var askPrice = ns.stock.getAskPrice(stock);
        var forecast = ns.stock.getForecast(stock);
        var volPer = ns.stock.getVolatility(stock);
        var playerMoney = ns.getServerMoneyAvailable('home');
        
        if (forecast >= stockBuyPer && volPer <= stockVolPer) {
            if (playerMoney - moneyKeep > ns.stock.getPurchaseCost(stock,minSharePer, "Long")) {
                var shares = Math.min((playerMoney - moneyKeep - 100000) / askPrice, maxShares);
                ns.stock.buy(stock, shares);
                ns.print('Bought: '+shares+ stock + '')
            }
        }      
    }

    function sellPositions(stock) {
        var forecast = ns.stock.getForecast(stock);
        if (forecast < 0.5) {
            ns.stock.sell(stock, position[0]);
            ns.print('Sold: '+position[0]+ stock + '')
        }
    }
}