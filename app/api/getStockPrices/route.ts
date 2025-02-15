// import { rateLimit } from "@/lib/rate-limit";
// import redisClient from "@/lib/redis";
// import axios from "axios";
// import { NextRequest, NextResponse } from "next/server";

import { NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   const ip = req.headers.get("x-forwarded-for") || req.ip;
//   const url = new URL(req.url);
//   const stocks = await req.json();
//   const cacheKey = `stockData-${stocks}`;
//   let stockData = [];
//   let stockPriceData = [];
//   let i = 0;

//   //   console.log("Types", typeof ip, typeof url);
//   const { remaining, isRateLimitReached } = await rateLimit(ip, url, 1, 1);

//   if (isRateLimitReached) {
//     return new Response("Rate limit reached", {
//       status: 429,
//       headers: {
//         "Retry-After": "1",
//       },
//     });
//   }

//   try {
//     // const cachedData = await redisClient.get(cacheKey);
//     // if (cachedData)
//     //   return new NextResponse(cachedData, {
//     //     status: 200,
//     //     headers: {
//     //       "X-RateLimit-Limit": "1",
//     //       "X-RateLimit-Remaining": remaining.toString(),
//     //       "X-RateLimit-Reset": new Date(Date.now() + 1000).toISOString(),
//     //     },
//     //   });

//     for (i; i < stocks.length; i++) {
//       let tempData = [];
//       let tempPriceData = [];
//       const { data } = await axios.get(
//         `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stocks[i]}&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY}`
//       );
//       console.log(data);
//       for (var key in data["Time Series (Daily)"]) {
//         tempData.push({
//           date: key,
//           close: data["Time Series (Daily)"][key]["4. close"],
//         });
//         tempPriceData.push({
//           open: data["Time Series (Daily)"][key]["1. open"],
//           high: data["Time Series (Daily)"][key]["2. high"],
//           low: data["Time Series (Daily)"][key]["3. low"],
//           volume: data["Time Series (Daily)"][key]["5. volume"],
//         });
//       }
//       stockData.push(tempData);
//       stockPriceData.push(tempPriceData);
//     }

//     // await redisClient.set(
//     //   cacheKey,
//     //   JSON.stringify([stockData, stockPriceData]),
//     //   {
//     //     EX: 86400,
//     //   }
//     // );
//     return new NextResponse(JSON.stringify([stockData, stockPriceData]), {
//       status: 200,
//       headers: {
//         "X-RateLimit-Limit": "1",
//         "X-RateLimit-Remaining": remaining.toString(),
//         "X-RateLimit-Reset": new Date(Date.now() + 1000).toISOString(),
//       },
//     });
//   } catch (error: any) {
//     console.log("Error", error);
//     return new NextResponse(error, { status: 500 });
//   }
// }


export async function GET() {
  try {
    return new NextResponse("Hi from the API")
  } catch (error: any) {
    console.error("Error getting stock prices", error);
    return new NextResponse(error, { status: 500 });
  }
}
