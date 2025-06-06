"use client";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Header() {

  const { isSignedIn } = useUser();
  return (
    <div className="p-5 flex justify-between items-center border shadow-sm">
      <Image src={'/logo2.svg'} alt="logo" width={40} height={40} />
      <Image src={'/name.png'} alt="logo" width={100} height={100} />


      {isSignedIn ? <UserButton /> :

        <Link href={'/sign-in'}>
          <Button>Get Started</Button>
        </Link>
      }

    </div>
  );
}