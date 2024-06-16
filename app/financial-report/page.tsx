"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/utils";
import { AreaChart } from "@tremor/react";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DonutChart } from "@tremor/react";
import { UserButton } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import FinReportTabs from "@/components/FinReportTabs";
import { useLayoutEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Transaction } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartSkeleton } from "@/components/Skeletons";

export default function FinancialReport() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [income, setIncome] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [biggestIncome, setBiggestIncome] = useState<Transaction | null>(null);
  const [biggestExpense, setBiggestExpense] = useState<Transaction | null>(
    null
  );

  const fetchTransactions = useMutation({
    mutationFn: async () => {
      const { data } = await axios.get("/api/getFinReportData");
      const { transactions } = data;
      setTransactions(transactions.income.concat(transactions.expenses));
      setIncome(transactions.income);
      setExpenses(transactions.expenses);
      setBiggestIncome(transactions.biggestIncome);
      setBiggestExpense(transactions.biggestExpense);
      return transactions;
    },
  });

  const expenseAmount = expenses
    .map((expense) => expense.amount)
    .reduce((sum, a) => sum + a, 0);
  const incomeAmount = income
    .map((income) => income.amount)
    .reduce((sum, a) => sum + a, 0);

  const balance = incomeAmount - expenseAmount;
  let total = 0;
  const lastTransaction = transactions
    ? transactions[transactions.length - 1]
    : undefined;
  const chartdata = transactions
    .map((transaction) => {
      const data = {
        date: transaction.createdAt.slice(4, 10),
        balance: total,
      };
      transaction.type === "income"
        ? (total += transaction.amount)
        : (total -= transaction.amount);
      return data;
    })
    .concat({
      date: lastTransaction?.createdAt.slice(4, 10) || "",
      balance: total,
    });

  const pieChartData = transactions
    .map((transaction) => {
      const data = {
        category: transaction.category,
        Amount: transaction.amount,
      };
      return data;
    })
    .concat({
      category: lastTransaction?.category || "",
      Amount: lastTransaction?.amount || 0,
    });

  useLayoutEffect(
    () =>
      fetchTransactions.mutate(undefined, {
        onSuccess: (data) => {
          console.log(data);
        },
        onError(error) {
          console.log("Error", error);
        },
      }),
    []
  );

  return (
    <Tabs defaultValue="income" className="w-full overflow-hidden">
      <TabsList className="w-full">
        <p onClick={() => router.back()} className="mr-5 text-sm font-medium">
          <ArrowLeftIcon />
        </p>
        <div className="mt-1 mr-5">
          <UserButton />
        </div>
        <Sheet>
          <SheetTrigger asChild className="sm:hidden">
            <Button variant={"outline"}>Tabs</Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col items-center">
            <TabsTrigger value="income" className="w-[200px]">
              Income
            </TabsTrigger>
            <TabsTrigger value="expenses" className="w-[200px]">
              Expenses
            </TabsTrigger>
            <TabsTrigger value="chart" className="w-[200px]">
              Report
              <Image
                src={"/images/chart-icon.svg"}
                alt="chart"
                width={48}
                height={48}
                className="w-[14px] h-[14px] md:w-5 md:h-5 object-cover rounded-full ml-2"
              />
            </TabsTrigger>
            <TabsTrigger value="pieChart" className="w-[200px]">
              Report
              <Image
                src={"/images/pie-chart-icon.svg"}
                alt="chart"
                width={48}
                height={48}
                className="w-7 h-7 object-cover rounded-full ml-2"
              />
            </TabsTrigger>
          </SheetContent>
        </Sheet>
        <TabsTrigger
          value="income"
          className="hidden sm:flex w-[150px] md:w-[200px]"
        >
          Income
        </TabsTrigger>
        <TabsTrigger
          value="expenses"
          className="hidden sm:flex w-[150px] md:w-[200px]"
        >
          Expenses
        </TabsTrigger>
        <TabsTrigger
          value="chart"
          className="hidden sm:flex w-[150px] md:w-[200px]"
        >
          Report
          <Image
            src={"/images/chart-icon.svg"}
            alt="chart"
            width={48}
            height={48}
            className="w-5 h-5 object-cover rounded-full ml-2"
          />
        </TabsTrigger>
        <TabsTrigger
          value="pieChart"
          className="hidden sm:flex w-[150px] md:w-[200px]"
        >
          Report
          <Image
            src={"/images/pie-chart-icon.svg"}
            alt="chart"
            width={48}
            height={48}
            className="w-5 h-5 object-cover rounded-full ml-2"
          />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="income" className="bg-[#00A86B] h-screen mt-0 pt-20">
        {fetchTransactions.isPending ? (
          <div className="flex flex-col h-full justify-evenly items-center">
            <Skeleton className="overflow-hidden">
              <h2 className="text-transparent text-2xl md:text-4xl bg-gradient-to-r from-transparent via-zinc-400/35 dark:via-zinc-700/40 to-transparent skeleton_animation overflow-hidden">
                This Month
              </h2>
            </Skeleton>
            <Skeleton className="overflow-hidden">
              <div className="text-center">
                <h3 className="text-2xl md:text-4xl text-transparent mb-5 bg-gradient-to-r from-transparent via-zinc-400/35 dark:via-zinc-700/40 to-transparent skeleton_animation overflow-hidden">
                  You Earned 💰
                </h3>
                <h3 className="text-3xl md:text-6xl text-transparent bg-gradient-to-r from-transparent via-zinc-400/35 dark:via-zinc-700/40 to-transparent skeleton_animation overflow-hidden">
                  {formatPrice(incomeAmount)}
                </h3>
              </div>
            </Skeleton>
            <Skeleton className="overflow-hidden">
              <div className="w-[300px] h-[200px] md:h-[250px] md:w-[450px] bg-gradient-to-r from-transparent via-zinc-400/35 dark:via-zinc-700/40 to-transparent skeleton_animation overflow-hidden" />
            </Skeleton>
          </div>
        ) : (
          <div className="flex flex-col h-full justify-evenly items-center">
            <h2 className="text-muted-foreground font-chillax text-2xl md:text-4xl font-medium">
              This Month
            </h2>
            <div className="text-center">
              <h3 className="text-2xl md:text-4xl font-semibold text-zinc-200 mb-5">
                You Earned 💰
              </h3>
              <h3 className="text-3xl md:text-6xl font-semibold text-zinc-100">
                {formatPrice(incomeAmount)}
              </h3>
            </div>
            <Card className="w-[300px] md:w-[400px]">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-center text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  Your biggest income was from.
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <Card className="w-52 mx-auto">
                  <CardContent className="flex items-center justify-evenly py-3 gap-2 font-semibold">
                    <Image
                      src={`/images/${biggestIncome?.category}-icon.svg`}
                      alt={"money bag"}
                      width={48}
                      height={48}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                    {biggestIncome?.category}
                  </CardContent>
                </Card>
                <p className="text-center font-medium text-lg md:text-3xl mt-3">
                  {formatPrice(biggestIncome?.amount || 0)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </TabsContent>
      <TabsContent
        value="expenses"
        className="bg-[#FD3C4A] h-screen mt-0 pt-20"
      >
        {fetchTransactions.isPending ? (
          <div className="flex flex-col h-full justify-evenly items-center">
            <Skeleton className="overflow-hidden">
              <h2 className="text-transparent text-2xl md:text-4xl bg-gradient-to-r from-transparent via-zinc-400/35 dark:via-zinc-700/40 to-transparent skeleton_animation overflow-hidden">
                This Month
              </h2>
            </Skeleton>
            <Skeleton className="overflow-hidden">
              <div className="text-center">
                <h3 className="text-2xl md:text-4xl text-transparent mb-5 bg-gradient-to-r from-transparent via-zinc-400/35 dark:via-zinc-700/40 to-transparent skeleton_animation overflow-hidden">
                  You Earned 💰
                </h3>
                <h3 className="text-3xl md:text-6xl text-transparent bg-gradient-to-r from-transparent via-zinc-400/35 dark:via-zinc-700/40 to-transparent skeleton_animation overflow-hidden">
                  {formatPrice(incomeAmount)}
                </h3>
              </div>
            </Skeleton>
            <Skeleton className="overflow-hidden">
              <div className="w-[300px] h-[200px] md:h-[250px] md:w-[450px] bg-gradient-to-r from-transparent via-zinc-400/35 dark:via-zinc-700/40 to-transparent skeleton_animation overflow-hidden" />
            </Skeleton>
          </div>
        ) : (
          <div className="flex flex-col h-full justify-evenly items-center">
            <h2 className="text-muted font-chillax text-xl md:text-4xl font-medium">
              This Month
            </h2>
            <div className="text-center">
              <h3 className="text-2xl md:text-4xl font-semibold text-zinc-200 mb-5">
                You Spent 💸
              </h3>
              <h3 className="text-3xl md:text-6xl font-semibold text-zinc-100">
                {formatPrice(expenseAmount)}
              </h3>
            </div>
            <Card className="w-[300px] md:w-[400px]">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-center text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  Your biggest expense was from.
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <Card className="w-52 mx-auto">
                  <CardContent className="flex items-center justify-evenly py-3 gap-2 font-semibold">
                    <Image
                      src={`/images/${biggestExpense?.category}-icon.svg`}
                      alt={"shopping basket"}
                      width={48}
                      height={48}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                    {biggestExpense?.category}
                  </CardContent>
                </Card>
                <p className="text-center font-medium text-lg md:text-3xl mt-3">
                  {formatPrice(biggestExpense?.amount || 0)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </TabsContent>
      <TabsContent value="chart">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-left text-tremor-content-strong dark:text-dark-tremor-content-strong">
            Balance {formatPrice(balance)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {fetchTransactions.isPending ? (
            <ChartSkeleton />
          ) : (
            <AreaChart
              className="mt-4 h-72"
              data={chartdata}
              valueFormatter={formatPrice}
              index="date"
              categories={["balance"]}
              colors={["purple"]}
              yAxisWidth={30}
            />
          )}
          <FinReportTabs
            income={income}
            expenses={expenses}
            loading={fetchTransactions.isPending}
          />
        </CardContent>
      </TabsContent>
      <TabsContent value="pieChart">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-left text-tremor-content-strong dark:text-dark-tremor-content-strong">
            Balance {formatPrice(balance)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {fetchTransactions.isPending ? (
            <Skeleton className="w-52 h-52 mx-auto rounded-full overflow-hidden">
              <div
                className={`w-52 h-52 bg-gradient-to-r from-transparent via-zinc-400/35 dark:via-zinc-700/40 to-transparent skeleton_animation overflow-hidden`}
              />
            </Skeleton>
          ) : (
            <DonutChart
              data={pieChartData}
              category="Amount"
              index="category"
              label="transactions"
              valueFormatter={formatPrice}
              colors={[
                "blue",
                "cyan",
                "indigo",
                "violet",
                "fuchsia",
                "purple",
                "green",
                "orange",
              ]}
              className="w-40 mx-auto"
            />
          )}
          <FinReportTabs
            income={income}
            expenses={expenses}
            loading={fetchTransactions.isPending}
          />
        </CardContent>
      </TabsContent>
    </Tabs>
  );
}
