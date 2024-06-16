"use client";

import React, { useLayoutEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import {
  ArrowRightLeftIcon,
  BanknoteIcon,
  HomeIcon,
  UserIcon,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { formatPrice } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import ButtonWithLoadingState from "./ButtonWithLoadingState";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  category: z.string({
    required_error: "Please select a category",
  }),
  amount: z.string({
    required_error: "Please enter an amount",
  }),
});

type FormSchemaType = z.infer<typeof FormSchema>;

export default function NavBar() {
  const [transaction, setTransaction] = useState("");
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const transactionForm = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const fetchUserId = useMutation({
    mutationFn: async () => {
      const { data } = await axios.get("/api/getUserId");
      console.log(data);
      setUserId(data);
      return data;
    },
  });

  const sendTransaction = useMutation({
    mutationFn: async (data: FormSchemaType) => {
      const resp = await axios.post("/api/transaction", {
        type: transaction,
        category: data.category,
        amount: data.amount,
        userId,
      });
      console.log(resp.data);
      router.refresh();
      return resp.data;
    },
  });

  function submitExpense(data: FormSchemaType) {
    setTransaction("expense");
    sendTransaction.mutate(data, {
      onSuccess({ message }) {
        console.log("Successfully submitted expense.", { message });
        toast.success("Expense submitted");
      },
      onError(error) {
        console.log("error", error);
        toast.error("Error submitting expense");
      },
    });
    transactionForm.reset();
  }

  function submitIncome(data: FormSchemaType) {
    setTransaction("income");
    sendTransaction.mutate(data, {
      onSuccess({ message }) {
        console.log("Successfully submitted income.", { message });
        toast.success("Income submitted");
      },
      onError(error) {
        console.log("error", error);
        toast.error("Error submitting income");
      },
    });
    transactionForm.reset();
  }

  const inputAmount = formatPrice(
    (parseInt(transactionForm.watch("amount")) * 100) | 0
  );

  useLayoutEffect(
    () =>
      fetchUserId.mutate(undefined, {
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
    <NavigationMenu className="hidden md:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/dashboard"
            className={`${navigationMenuTriggerStyle()} flex flex-col items-center mx-3 gap-2 hover:bg-transparent`}
          >
            <Button
              variant={"ghost"}
              className="md:w-[100px] hover:bg-transparent"
            >
              <HomeIcon />
            </Button>
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <div className="flex flex-col items-center gap-3 mx-3 text-sm font-medium">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="md:w-[100px] hover:bg-transparent"
                >
                  <Image
                    src={"/images/Income.svg"}
                    alt="money in"
                    width={48}
                    height={48}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <Form {...transactionForm}>
                  <form
                    onSubmit={transactionForm.handleSubmit(submitIncome)}
                    className="flex flex-col justify-evenly"
                  >
                    <h2 className="font-semibold font-chillax text-base md:text-xl text-center">
                      Income
                    </h2>
                    <div className="mt-2">
                      <h4 className="text-zinc-400 dark:text-zinc-300 text-xs md:text-sm">
                        How Much?
                      </h4>
                      <p className="font-semibold text-lg md:text-2xl text-zinc-500 dark:text-zinc-200">
                        {inputAmount}
                      </p>
                    </div>
                    <FormField
                      control={transactionForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="my-2">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full md:h-[40px]">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Category</SelectLabel>
                                <SelectItem value="salary">Salary</SelectItem>
                                <SelectItem value="otherIncome">
                                  Other
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={transactionForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={formatPrice(10000).toString()}
                              type="number"
                              className="md:h-[40px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <ButtonWithLoadingState
                      isPending={sendTransaction.isPending}
                      text="Add Income"
                      loadingText="Adding Transaction..."
                      className="w-full mt-4"
                    />
                  </form>
                </Form>
              </PopoverContent>
            </Popover>
            New Income
          </div>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <div className="flex flex-col items-center gap-3 mx-3 text-sm font-medium">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="md:w-[100px] hover:bg-transparent"
                >
                  <Image
                    src={"/images/Expense.svg"}
                    alt="money in"
                    width={48}
                    height={48}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <Form {...transactionForm}>
                  <form
                    onSubmit={transactionForm.handleSubmit(submitExpense)}
                    className="flex flex-col justify-evenly"
                  >
                    <h2 className="font-semibold font-chillax text-base md:text-xl text-center">
                      Expense
                    </h2>
                    <div className="mt-2">
                      <h4 className="text-zinc-400 dark:text-zinc-300 text-xs md:text-sm">
                        How Much?
                      </h4>
                      <p className="font-semibold text-lg md:text-2xl text-zinc-500 dark:text-zinc-200">
                        {inputAmount}
                      </p>
                    </div>
                    <FormField
                      control={transactionForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="my-2">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full md:h-[40px]">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Category</SelectLabel>
                                <SelectItem value="food">Food</SelectItem>
                                <SelectItem value="subscriptions">
                                  Subscriptions
                                </SelectItem>
                                <SelectItem value="shopping">
                                  Shopping
                                </SelectItem>
                                <SelectItem value="transportation">
                                  Transportation
                                </SelectItem>
                                <SelectItem value="otherExpense">
                                  Other
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={transactionForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={formatPrice(10000).toString()}
                              type="number"
                              className="md:h-[40px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <ButtonWithLoadingState
                      isPending={sendTransaction.isPending}
                      text="Add Expense"
                      loadingText="Adding Transaction..."
                      className="w-full mt-4"
                    />
                  </form>
                </Form>
              </PopoverContent>
            </Popover>
            New Expense
          </div>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={`${navigationMenuTriggerStyle()} flex flex-col items-center gap-2 mx-3 hover:bg-transparent`}
            href="/transactions"
          >
            <Button
              variant={"ghost"}
              className="md:w-[100px] hover:bg-transparent"
            >
              <ArrowRightLeftIcon />
            </Button>
            Transactions
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={`${navigationMenuTriggerStyle()} flex flex-col items-center gap-2 mx-3 hover:bg-transparent`}
            href="/financial-report"
          >
            <Button
              variant={"ghost"}
              className="md:w-[100px] hover:bg-transparent"
            >
              <BanknoteIcon />
            </Button>
            Financial Report
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={`${navigationMenuTriggerStyle()} flex flex-col items-center gap-2 mx-3 hover:bg-transparent`}
            href="/user-profile"
          >
            <Button
              variant={"ghost"}
              className="md:w-[100px] hover:bg-transparent"
            >
              <UserIcon />
            </Button>
            User Page
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
