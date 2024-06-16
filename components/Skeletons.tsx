import { formatPrice } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

export function FinReportSkeleton() {
    return (
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
          {formatPrice(100000)}
        </h3>
      </div>
      </Skeleton>
      <Skeleton className="overflow-hidden">
      <div className="w-[300px] h-[200px] md:h-[250px] md:w-[450px] bg-gradient-to-r from-transparent via-zinc-400/35 dark:via-zinc-700/40 to-transparent skeleton_animation overflow-hidden"/>
      </Skeleton>
    </div>
    )
  }

  export function ChartSkeleton() {
    return (
      <Skeleton className="w-full h-72 md:h-96 overflow-hidden">
        <div
          className="w-full h-72 md:h-96 bg-gradient-to-r from-transparent via-zinc-400/35 dark:via-zinc-700/40 to-transparent skeleton_animation overflow-hidden"
        />
      </Skeleton>
    );
  }

  export function TransactionSkeleton() {
    return (
      <Skeleton
        className={`w-full h-20 rounded-3xl shadow-md overflow-hidden my-3`}
      >
        <div
          className="w-full h-20 bg-gradient-to-r from-transparent via-zinc-400/35 dark:via-zinc-700/40 to-transparent skeleton_animation overflow-hidden"
        />
      </Skeleton>
    );
  }