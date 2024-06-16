"use client";

import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  isPending: boolean;
  text: string;
  loadingText: string;
  className?: string;
};

export default function ButtonWithLoadingState({
  isPending,
  loadingText,
  text,
  className,
}: Props) {
  return (
    <div>
      <Button disabled={isPending} type="submit" className={className}>
        {isPending ? (
          <>
            <Loader2 className="animate-spin mr-2" />
            {loadingText}
          </>
        ) : (
          <>{text}</>
        )}
      </Button>
    </div>
  );
}
