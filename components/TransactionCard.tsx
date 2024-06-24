"use client";

import { CardDescription, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EditIcon, Trash2Icon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import ButtonWithLoadingState from "./ButtonWithLoadingState";
import { useLayoutEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  title: string;
  amount: number;
  type: string;
  category: string;
  id: string;
};

const EditTransactionFormSchema = z.object({
  amount: z.string({
    required_error: "Please enter an amount",
  }),
});

type EditTransactionSchemaType = z.infer<typeof EditTransactionFormSchema>;

export default function TransactionCard({
  title,
  amount,
  type,
  category,
  id,
}: Props) {
  const router = useRouter();
  const editTransactionForm = useForm<EditTransactionSchemaType>({
    resolver: zodResolver(EditTransactionFormSchema),
  });

  const editTransaction = useMutation({
    mutationFn: async (data: EditTransactionSchemaType) => {
      const resp = await axios.put(`/api/editTransaction/${id}`, {
        amount: data.amount,
      });
      console.log(resp.data);
      router.refresh();
      return resp.data;
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async () => {
      const resp = await axios.delete(`/api/deleteTransaction/${id}`);
      return resp;
    },
  });

  function handleEdit(data: EditTransactionSchemaType) {
    editTransaction.mutate(data, {
      onSuccess({ message }) {
        console.log("Successfully edited transaction.", { message });
        toast.success("Expense submitted");
      },
      onError(error) {
        console.log("Error", error);
        toast.error("Error editing transaction. Please try again.");
      },
    });
    editTransactionForm.reset();
  }

  function handleDelete() {
    deleteTransaction.mutate(undefined, {
      onSuccess(data) {
        console.log("Success", data);
        toast.success("Successfully deleted transaction.");
        router.refresh();
      },
      onError() {
        console.log("Error");
        toast.error("Error deleting transaction. Please try again.");
      },
    });
  }

  const inputAmount = formatPrice(
    (parseInt(editTransactionForm.watch("amount")) * 100) | 0
  );

  return (
    <>
      <div className="flex justify-between items-center">
        <CardHeader>
          <CardTitle className="tex-xs sm:text-base md:text-lg flex flex-col md:flex-row md:items-center gap-1 font-medium text-left text-tremor-content-strong dark:text-dark-tremor-content-strong">
            <Image
              src={`/images/${
                category.includes("other") ? "other" : category
              }-icon.svg`}
              alt={category}
              width={60}
              height={60}
              className="w-6 h-6 md:w-14 md:h-14"
            />
            <p className="md:hidden">
              {title.substring(0, 6)}
              {title.length > 6 && <span>...</span>}
            </p>
            <p className="hidden md:block">
              {title === "otherIncome" ? (
                <span>other Income</span>
              ) : title === "otherExpense" ? (
                <span>other Expense</span>
              ) : (
                title
              )}
            </p>
          </CardTitle>
        </CardHeader>
        <div className="flex items-center">
          <CardDescription>
            <p
              className={`text-xs md:text-base font-semibold pr-5 text-left ${
                type === "income" ? "text-[#00A86B]" : "text-[#FD3C4A]"
              }`}
            >
              {type === "income" ? "+" : "-"} {formatPrice(amount)}
            </p>
          </CardDescription>
          <Popover>
            <PopoverTrigger className="mr-1" asChild>
              <EditIcon className="w-3 h-3 md:w-4 md:h-4" />
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <Form {...editTransactionForm}>
                <form
                  onSubmit={editTransactionForm.handleSubmit(handleEdit)}
                  className="flex flex-col justify-evenly"
                >
                  <h2 className="font-semibold font-chillax text-base md:text-xl text-center">
                    Edit Transaction
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
                    control={editTransactionForm.control}
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
                    isPending={editTransaction.isPending}
                    text="Edit Transaction"
                    loadingText="Editing Transaction..."
                    className="w-full mt-4"
                  />
                </form>
              </Form>
            </PopoverContent>
          </Popover>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Trash2Icon className="w-3 h-3 md:w-4 md:h-4 text-red-700" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this transaction?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this transaction.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
}
