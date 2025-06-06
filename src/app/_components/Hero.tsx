"use client"
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function Hero() {

  const { isSignedIn } = useUser(); // Verifica si el usuario está logueado

  
  return (
    <section className="bg-white flex items-center flex-col">
      <div className="mx-auto w-screen max-w-screen-xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-prose text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Manager Your Expense
            <strong className="text-primary"> Control your Money </strong>

          </h1>

          <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
            Start Creating your budget and save ton of money
          </p>

          <div className="mt-4 flex justify-center gap-4 sm:mt-6">
            <a
              className="inline-block rounded border border-primary bg-primary px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-cyan-800"
              href={isSignedIn ? '/dashboard' : '/sign-in'}
            >
              Get Started
            </a>


          </div>
        </div>
      </div>
      <Image src={'/4.png'} alt='dashboard'
        width={800}
        height={500}
        className="-mt-9 rounded-xl border-2"
      />
    </section>
  );
}