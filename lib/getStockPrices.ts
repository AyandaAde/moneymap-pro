import axios from "axios";

export async function getStockPrices(stocks: string[]): Promise<any> {
  let stockData = [];
  let i = 0;
  try {
    for(i; i < stocks.length; i++){
        let tempData = [];
        const { data } = await axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stocks[i]}&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY}`
          ); 
          console.log(data)
          for (var key in data["Time Series (Daily)"]) {
            tempData.push({
              date: key,
              close: data["Time Series (Daily)"][key]["4. close"],
            });
          }
          stockData.push(tempData);          
    }
    
    return stockData;
  } catch (error) {
    console.log("Error", error);
    return "Error getting stock data";
  }
}
