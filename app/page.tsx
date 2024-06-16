"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { fadeIn, fadeUpAndOut } from "@/public/animations";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import DarkModeSlider from "@/components/DarkModeSlider";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export default function Home() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <BackgroundGradientAnimation>
        <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
          <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
            MoneyMap Pro
            <p className="text-xl md:text-3xl mt-2">Click to get started</p>
          </p>
        </div>
      </BackgroundGradientAnimation>
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeIn}
        transition={{ delay: 2 }}
        className="h-screen flex flex-col justify-center items-center"
      >
        <Image
          src={"/images/onboarding-illustration.svg"}
          alt="hand holding money."
          width={1920}
          height={1080}
          className="w-2/5 h-2/5"
        />
        <h2 className="font-chillax font-semibold text-4xl md:text-5xl text-center">
          Take control of your finances
        </h2>
        <p className="text-base md:text-xl text-center mx-1">
          Become your own money manager and make every cent count
        </p>
        <Button
          className="mt-10 mb-5 w-[150px] md:w-[250px] h-12 text-lg md:text-xl"
          onClick={() => router.push("/sign-in")}
        >
          Sign In
        </Button>
        <Button
          className="w-[150px] md:w-[250px] h-12 text-lg md:text-xl text-[#7F3DFF] bg-[#EEE5FF] hover:text-white"
          onClick={() => router.push("/sign-up")}
        >
          Sign Up
        </Button>
        <DarkModeSlider />
      </motion.div>
    </>
  );
}
