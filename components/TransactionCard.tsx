import React from "react";
import { CardDescription, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

type Props = {
  title: string;
  amount: number;
  type: string;
  category: string;
};

export default function TransactionCard({
  title,
  amount,
  type,
  category,
}: Props) {
  return (
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
      <CardDescription>
        <p
          className={`text-xs md:text-base font-semibold pr-5 text-left ${
            type === "income" ? "text-[#00A86B]" : "text-[#FD3C4A]"
          }`}
        >
          {type === "income" ? "+" : "-"} {formatPrice(amount)}
        </p>
      </CardDescription>
    </div>
  );
}
