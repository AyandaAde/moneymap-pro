"use client";

import DarkModeSlider from "@/components/DarkModeSlider";
import NavBar from "@/components/NavBar";
import TransactionCard from "@/components/TransactionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { UserButton } from "@clerk/nextjs";
import MobileNav from "@/components/MobileNav";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Transaction } from "@/lib/types";
import { subDays } from "date-fns";
import { useRouter } from "next/navigation";
import { TransactionSkeleton } from "@/components/Skeletons";
import PaginationComp from "@/components/PaginationComp";

const FilterFormSchema = z.object({
  filter: z.string(),
  sort: z.string(),
  category: z.string(),
});

type FilterFormType = z.infer<typeof FilterFormSchema>;

export default function Transactions() {
  const [timePeriod, setTimePeriod] = useState("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [results, setResults] = useState(0);
  const router = useRouter();
  let loading = false;

  const fetchTransactions = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post("/api/getTransactions", {
        date: timePeriod,
      });
      console.log(data);
      setTransactions(data);
      return data;
    },
  });

  const search = useMutation({
    mutationFn: async (searchData: FilterFormType) => {
      const { data } = await axios.post("/api/search", {
        filter,
        sort,
        category: searchData.category,
        date: timePeriod,
      });
      console.log(data);
      setTransactions(data);
      router.refresh();
      return data;
    },
  });

  const filterForm = useForm<FilterFormType>({
    resolver: zodResolver(FilterFormSchema),
    defaultValues: {
      filter,
      sort,
      category: "",
    },
  });

  function onSubmit(searchData: FilterFormType) {
    search.mutate(searchData, {
      onSuccess(data) {
        console.log("Successfully searched transactions.", data);
      },
      onError(error) {
        console.log("Error", error);
        toast.error("Error searching transactions");
      },
    });
  }

  function handleSelectChange(value: string) {
    if (value === "today") setTimePeriod(new Date().toString().slice(0, 15));
    else if (value === "yesterday")
      setTimePeriod(subDays(new Date(), 1).toString().slice(0, 15));
    else setTimePeriod("all");
    fetchTransactions.mutate(undefined, {
      onSuccess: (data) => {
        console.log(data);
      },
      onError(error) {
        console.log("Error", error);
      },
    });
  }

  useEffect(
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

  if (fetchTransactions.isPending || search.isPending) loading = true;
  return (
    <div className="w-full md:w-8/12 py-10 md:py-20 mx-auto flex flex-col justify-center items-center">
      <Button className="bg-[#EEE5FF] text-primary text-sm md:text-base hover:text-white w-[89%] h-[40px] md:h-[60px]">
        <Link href="/financial-report" className="w-full flex justify-between">
          See your financial Report <ArrowRight />
        </Link>
      </Button>
      <div className="w-[89%] mt-3 flex gap-2 justify-between items-center">
        <Select onValueChange={handleSelectChange} defaultValue="all">
          <SelectTrigger className="w-[100px] md:w-[180px]">
            <SelectValue placeholder="Today" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="all">All Transactions</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex">
          <div className="mt-2 md:mt-5 mr-3">
            <UserButton />
          </div>
          <Sheet>
            <SheetTrigger>
              <Button
                variant={"outline"}
                className="md:mt-3 rounded-xl p-3 h-[35px] flex-col gap-1"
              >
                <div className="border border-b-1 w-[20px] border-foreground" />
                <div className="border border-b-1 w-[16px] border-foreground" />
                <div className="border border-b-1 w-[12px] border-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent side={"bottom"} className="px-10 md:px-80">
              <SheetHeader>
                <SheetTitle className="flex justify-between mt-5">
                  <h3 className="font-semibold text-base md:text-lg">
                    Filter Transactions
                  </h3>
                  <Button
                    variant={"ghost"}
                    onClick={() => {
                      setFilter("");
                      setSort("");
                    }}
                    className="bg-[#EEE5FF] text-primary w-14 h-8 md:w-16 md:h-10 rounded-3xl"
                  >
                    Reset
                  </Button>
                </SheetTitle>
              </SheetHeader>
              <Form {...filterForm}>
                <form
                  onSubmit={filterForm.handleSubmit(onSubmit)}
                  className="space-y-5 text-muted-foreground"
                >
                  <FormField
                    control={filterForm.control}
                    name="filter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base md:text-lg text-foreground">
                          Filter By
                        </FormLabel>
                        <div className="flex gap-3 mt-1">
                          <Button
                            variant={"ghost"}
                            type="button"
                            onClick={() => setFilter("income")}
                            className={`w-[100px] ${
                              filter === "income" && `bg-[#EEE5FF] text-primary`
                            } rounded-3xl`}
                          >
                            Income
                          </Button>
                          <Button
                            variant={"ghost"}
                            type="button"
                            onClick={() => setFilter("expense")}
                            className={`w-[100px] ${
                              filter === "expense" &&
                              `bg-[#EEE5FF] text-primary`
                            } rounded-3xl`}
                          >
                            Expense
                          </Button>
                        </div>
                        <FormControl>
                          <Input type="hidden" {...field} value={filter} />
                        </FormControl>
                        <FormDescription>
                          Please select a filter.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={filterForm.control}
                    name="sort"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base md:text-lg text-foreground">
                          Sort By
                        </FormLabel>
                        <div className="flex flex-wrap gap-3 mt-1">
                          <Button
                            variant={"ghost"}
                            type="button"
                            onClick={() => setSort("highest")}
                            className={`w-[100px] ${
                              sort === "highest" && `bg-[#EEE5FF] text-primary`
                            } rounded-3xl`}
                          >
                            Highest
                          </Button>
                          <Button
                            variant={"ghost"}
                            type="button"
                            onClick={() => setSort("lowest")}
                            className={`w-[100px] ${
                              sort === "lowest" && `bg-[#EEE5FF] text-primary`
                            } rounded-3xl`}
                          >
                            Lowest
                          </Button>
                          <Button
                            variant={"ghost"}
                            type="button"
                            onClick={() => setSort("oldest")}
                            className={`w-[100px] ${
                              sort === "oldest" && `bg-[#EEE5FF] text-primary`
                            } rounded-3xl`}
                          >
                            Oldest
                          </Button>
                          <Button
                            variant={"ghost"}
                            type="button"
                            onClick={() => setSort("newest")}
                            className={`w-[100px] ${
                              sort === "newest" && `bg-[#EEE5FF] text-primary`
                            } rounded-3xl`}
                          >
                            Newest
                          </Button>
                        </div>
                        <FormControl>
                          <Input type="hidden" {...field} value={sort} />
                        </FormControl>
                        <FormDescription>
                          Please select a sort option.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={filterForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base md:text-lg text-foreground">
                          Category
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full mt-1">
                              <SelectValue placeholder="Choose a Category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="shopping">Shopping</SelectItem>
                            <SelectItem value="food">Food</SelectItem>
                            <SelectItem value="subscriptions">
                              Subscriptions
                            </SelectItem>
                            <SelectItem value="transportation">
                              Transportation
                            </SelectItem>
                            <SelectItem value="salary">Salary</SelectItem>
                            <SelectItem value="otherIncome">
                              Other Income
                            </SelectItem>
                            <SelectItem value="otherExpense">
                              Other Expenses
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <SheetFooter className="">
                    <SheetClose asChild>
                      <Button
                        type="submit"
                        className="w-full md:h-[40px] text-lg"
                      >
                        Apply
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </form>
              </Form>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <Card className="w-11/12 mt-3 mb-7">
        <CardTitle className="ml-10 mt-5 text-lg md:text-2xl font-semibold text-left text-tremor-content-strong dark:text-dark-tremor-content-strong">
          {timePeriod === "today"
            ? "Today"
            : timePeriod === "yesterday"
            ? "Yesterday"
            : "All Transactions"}
        </CardTitle>

        <>
          {loading ? (
            <CardContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <TransactionSkeleton key={index} />
              ))}
            </CardContent>
          ) : (
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-center my-3">No transactions found</p>
              ) : (
                <>
                  {transactions
                    .slice(results, results + 5)
                    .map((transaction) => (
                      <TransactionCard
                        key={transaction.id}
                        amount={transaction.amount}
                        type={transaction.type}
                        category={transaction.category}
                        title={transaction.category}
                      />
                    ))}
                </>
              )}
              <PaginationComp
                length={transactions.length}
                results={results}
                setResults={setResults}
              />
            </CardContent>
          )}
        </>
      </Card>
      <NavBar />
      <MobileNav />
      <DarkModeSlider />
    </div>
  );
}
