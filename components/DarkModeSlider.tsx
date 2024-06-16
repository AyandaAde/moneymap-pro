"use client";

import { ComputerIcon, MoonStarIcon, SunIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";

export default function DarkModeSlider() {
  const { setTheme, theme } = useTheme();
  return (
    <div className="flex rounded-full mt-10 border border-1">
      <Button
        variant="ghost"
        className={`rounded-full w-14 md:w-[100px]  border-0 ${
          theme === "light" && "bg-muted-foreground border-1"
        }`}
        onClick={() => setTheme("light")}
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem] transition-all" />
        <span className="sr-only">Toggle theme</span>
      </Button>
      <Button
        variant="ghost"
        className={`rounded-full w-14 md:w-[100px]  border-0 ${
          theme === "dark" && "bg-muted-foreground border-1"
        }`}
        onClick={() => setTheme("dark")}
      >
        <MoonStarIcon className="absolute h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
      <Button
        variant="ghost"
        className={`rounded-full w-14 md:w-[100px]  border-0 ${
          theme === "system" && "bg-muted-foreground border-1"
        }`}
        onClick={() => setTheme("system")}
      >
        <ComputerIcon />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}
