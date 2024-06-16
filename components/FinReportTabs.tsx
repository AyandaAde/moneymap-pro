"use client";

import { Transaction } from "@/lib/types";
import TransactionCard from "./TransactionCard";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TransactionSkeleton } from "./Skeletons";
import { useState } from "react";
import PaginationComp from "./PaginationComp";

type Props = {
  expenses: Transaction[];
  income: Transaction[];
  loading: boolean;
};

export default function FinReportTabs({ expenses, income, loading }: Props) {
  const [results, setResults] = useState(0);

  return (
    <Tabs
      defaultValue="income"
      className="w-[250px] md:w-[600px] rounded-full mx-auto mt-5"
    >
      <TabsList className="w-full">
        <TabsTrigger value="income" className="rounded-full w-1/2">
          Income
        </TabsTrigger>
        <TabsTrigger value="expense" className="rounded-full w-1/2">
          Expenses
        </TabsTrigger>
      </TabsList>
      <TabsContent value="income">
        {loading ? (
          <>
            {Array.from({ length: 5 }).map((_, index) => (
              <TransactionSkeleton key={index} />
            ))}
          </>
        ) : (
          <>
            {income.length > 0 ? (
              <Card className="pb-5">
                <CardContent>
                  {income.slice(results, results + 5).map((income) => (
                    <TransactionCard
                      key={income.id}
                      amount={income.amount}
                      type={income.type}
                      category={income.category}
                      title={income.category}
                    />
                  ))}
                </CardContent>
                <PaginationComp
                  length={income.length}
                  results={results}
                  setResults={setResults}
                />
              </Card>
            ) : (
              <p className="text-sm md:text-base text-center">
                No income transactions yet.
              </p>
            )}
          </>
        )}
      </TabsContent>
      <TabsContent value="expense">
        {expenses.length > 0 ? (
          <Card className="pb-5">
            <CardContent>
              {expenses.slice(results, results + 5).map((expense) => (
                <TransactionCard
                  key={expense.id}
                  amount={expense.amount}
                  type={expense.type}
                  category={expense.category}
                  title={expense.category}
                />
              ))}
            </CardContent>
            <CardFooter>
              <PaginationComp
                length={expenses.length}
                results={results}
                setResults={setResults}
              />
            </CardFooter>
          </Card>
        ) : (
          <p className="text-sm md:text-base text-center">
            No expense transactions yet.
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}
