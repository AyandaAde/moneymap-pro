import { cn, formatPrice } from "@/lib/utils";
import Image from "next/image";
import { AreaChart, Tab } from "@tremor/react";
import DarkModeSlider from "@/components/DarkModeSlider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionCard from "@/components/TransactionCard";
import NavBar from "@/components/NavBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserButton } from "@clerk/nextjs";
import MobileNav from "@/components/MobileNav";
import { prisma } from "@/lib/db/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { getStockPrices } from "@/lib/getStockPrices";
import { sortBy } from "lodash";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartSkeleton, TransactionSkeleton } from "@/components/Skeletons";

export default async function Dashboard() {
  const user = await currentUser();
  const stocks = ["IBM", "AAPL", "TSLA"];
  const data = await getStockPrices(stocks);
  let loading = true;
  const { id, fullName, imageUrl, emailAddresses } = user!;
  const dbUser = await prisma.user.findUnique({
    where: {
      userId: id,
    },
  });

  if (!dbUser) {
    await prisma.user.create({
      data: {
        userId: id!,
        fullName: fullName || "",
        image: imageUrl,
        email: emailAddresses[0].emailAddress,
      },
    });
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        {
          userId: dbUser?.id!,
        },
        {
          userId: "494729302049485739320393",
        },
      ],
    },
    orderBy: {
      id: "desc",
    },
    take: 5,
  });

  const expenses = await prisma.transaction.findMany({
    where: {
      OR: [
        {
          userId: dbUser?.id!,
        },
        {
          userId: "494729302049485739320393",
        },
      ],
      AND: [
        {
          type: "expense",
        },
      ],
    },
  });

  const income = await prisma.transaction.findMany({
    where: {
      OR: [
        {
          userId: dbUser?.id!,
        },
        {
          userId: "494729302049485739320393",
        },
      ],
      AND: [
        {
          type: "income",
        },
      ],
    },
  });

  const expenseAmount = expenses
    .map((expense) => expense.amount)
    .reduce((sum, a) => sum + a, 0);
  const incomeAmount = income
    .map((income) => income.amount)
    .reduce((sum, a) => sum + a, 0);

  const balance = incomeAmount - expenseAmount;

  const chartdata = transactions.map((transaction) => {
    const data = {
      transaction: transaction.category,
      amount: transaction.amount / 100,
    };
    return data;
  });

  const stockChartData = stocks.map((stock, index) => {
    return {
      name: stock,
      data: sortBy(data[0][index], "date"),
      priceData: data[1][index],
    };
  });
  if (income && expenses && transactions) loading = false;

  return (
    <div className="flex flex-col justify-center items-center pb-10 pd:mb-20">
      <div className="w-full flex flex-col items-center bg-gradient-to-b from-[#8B50FF]/35 to-[#8B50FF]/0">
        <h2 className="text-muted-foreground mt-20 text-base md:text-xl">
          Welcome {fullName && fullName}
        </h2>
        <h1 className="text-muted-foreground mt-10 text-base md:text-xl">
          Account Balance
        </h1>
        {loading ? (
          <Skeleton className={`rounded-md shadow-md overflow-hidden`}>
            <h2 className="text-4xl text-transparent bg-gradient-to-r from-transparent via-zinc-400/35 dark:via-zinc-700/40 to-transparent skeleton_animation overflow-hidden">
              {formatPrice(10000)}
            </h2>
          </Skeleton>
        ) : (
          <h2 className="font-bold text-4xl">{formatPrice(balance) || 0}</h2>
        )}
        {loading ? (
          <div className="flex flex-col md:flex-row gap-2 p-5">
            <Skeleton
              className={`w-[180px] h-[90px] rounded-3xl shadow-md overflow-hidden`}
            >
              <div className="w-[180px] h-[90px] bg-gradient-to-r from-transparent via-zinc-400/35 dark:via-zinc-700/40 to-transparent skeleton_animation overflow-hidden" />
            </Skeleton>
            <Skeleton
              className={`w-[180px] h-[90px] rounded-3xl shadow-md overflow-hidden`}
            >
              <div className="w-[180px] h-[90px] bg-gradient-to-r from-transparent via-zinc-400/35 dark:via-zinc-700/40 to-transparent skeleton_animation overflow-hidden" />
            </Skeleton>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-2 p-5">
            <div className="bg-[#00A86B] rounded-3xl text-[#FCFCFC] flex flex-row items-center p-4 gap-2">
              <Image
                src={"/images/money-in-icon.svg"}
                alt="money in"
                width={48}
                height={48}
              />
              <div>
                <h3>Income</h3>
                <p className="font-semibold">
                  {formatPrice(incomeAmount) || 0}
                </p>
              </div>
            </div>
            <div className="bg-[#FD3C4A] rounded-3xl text-[#FCFCFC] flex flex-row items-center p-4 gap-2">
              <Image
                src={"/images/money-out-icon.svg"}
                alt="money out"
                width={48}
                height={48}
              />
              <div>
                <h3>Expenses</h3>
                <p className="font-semibold">
                  {formatPrice(expenseAmount) || 0}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-full rounded-none bg-background">
        <Tabs defaultValue="spend" className="w-full">
          <TabsList className="w-full">
            <div className="mr-5 mt-1">
              <UserButton />
            </div>
            <TabsTrigger value="spend" className="md:w-[200px]">
              Transactions
            </TabsTrigger>
            <TabsTrigger value="stocks" className="md:w-[200px]">
              Stocks
            </TabsTrigger>
          </TabsList>
          <TabsContent value="spend">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-left text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <ChartSkeleton />
              ) : (
                <AreaChart
                  className="mt-4 h-72"
                  data={chartdata}
                  index="transaction"
                  categories={["amount"]}
                  colors={["blue"]}
                  yAxisWidth={30}
                />
              )}
            </CardContent>
          </TabsContent>
          <TabsContent value="stocks">
            <Tabs defaultValue={stocks[0]}>
              <TabsList className="w-full">
                {stocks.map((stock, index) => (
                  <TabsTrigger
                    key={index}
                    value={stock}
                    className="md:w-[200px]"
                  >
                    {stock}
                  </TabsTrigger>
                ))}
              </TabsList>
              {stocks.map((stock, index) => (
                <TabsContent key={index} value={stock}>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-left text-tremor-content-strong dark:text-dark-tremor-content-strong">
                      Daily Close Data
                      {data[0][index] && (
                        <div className="flex items-center">
                          <h3 className="text-muted-foreground text-lg md:text-2xl mt-2">
                            {Object.values(
                              stockChartData[index].data[
                                stockChartData[index].data.length - 1
                              ].close
                            )}
                          </h3>
                          <p
                            className={`text-base md:text-xl mt-2 ml-2
                          ${
                            Object.values(
                              stockChartData[index].data[
                                stockChartData[index].data.length - 1
                              ].close
                            ) >
                            Object.values(
                              stockChartData[index].data[
                                stockChartData[index].data.length - 2
                              ].close
                            )
                              ? "text-green-500"
                              : "text-red-500"
                          }
                            `}
                          >
                            Yesterday close
                          </p>
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AreaChart
                      className="mt-4 h-72"
                      data={stockChartData[index].data}
                      index="date"
                      categories={["close"]}
                      colors={["blue"]}
                      yAxisWidth={30}
                    />
                    <div className="flex flex-wrap gap-y-2 justify-between mt-2">
                      <div>
                        <h3 className="font-medium">Yesterday Open</h3>
                        <p>
                          {Object.values(
                            stockChartData[index].priceData[0].open
                          )}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">Yesterday High</h3>
                        <p>
                          {Object.values(
                            stockChartData[index].priceData[0].high
                          )}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">Yesterday Low</h3>
                        <p>
                          {Object.values(
                            stockChartData[index].priceData[0].low
                          )}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">Yesterday Volume</h3>
                        <p>
                          {Object.values(
                            stockChartData[index].priceData[0].volume
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
      <div className="w-full md:w-7/12 rounded-none bg-background">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-left text-tremor-content-strong dark:text-dark-tremor-content-strong">
            Most Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="pt-5 shadow-md">
              <CardContent>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TransactionSkeleton key={index} />
                ))}
              </CardContent>
            </Skeleton>
          ) : (
            <>
              {transactions.length > 0 ? (
                <Card>
                  <CardContent>
                    {transactions.map((transaction) => (
                      <TransactionCard
                        key={transaction.id}
                        amount={transaction.amount}
                        type={transaction.type}
                        category={transaction.category}
                        title={transaction.category}
                      />
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <p className="mb-5">
                  No recent transactions. Add a new income or expense using one
                  of the buttons below
                </p>
              )}
            </>
          )}
        </CardContent>
      </div>
      <NavBar />
      <MobileNav />
      <DarkModeSlider />
    </div>
  );
}
