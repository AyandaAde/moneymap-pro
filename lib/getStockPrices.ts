import axios from "axios";

export async function getStockPrices(stocks: string[]): Promise<any> {
  let stockData = [];
  let stockPriceData = [];
  let i = 0;
  try {
    for (i; i < stocks.length; i++) {
      let tempData = [];
      let tempPriceData = [];
      const { data } = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stocks[i]}&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY}`
      );
      console.log(data);
      for (var key in data["Time Series (Daily)"]) {
        tempData.push({
          date: key,
          close: data["Time Series (Daily)"][key]["4. close"],
        });
        tempPriceData.push({
          open: data["Time Series (Daily)"][key]["1. open"],
          high: data["Time Series (Daily)"][key]["2. high"],
          low: data["Time Series (Daily)"][key]["3. low"],
          volume: data["Time Series (Daily)"][key]["5. volume"],
        });
      }
      stockData.push(tempData);
      stockPriceData.push(tempPriceData);
    }

    return [stockData, stockPriceData];
  } catch (error) {
    console.log("Error", error);
    return "Error getting stock data";
  }
}
