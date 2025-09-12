"use client";

import { getAurinkoAuthUrl } from "@/libs/aurinko";
import { Button } from "./ui/button";

export const LinkAccountButton = () => {
  return (
    <Button
      onClick={async () => {
        const authUrl = await getAurinkoAuthUrl("Google");
        console.log("this is authurl", authUrl);
        window.location.href = authUrl;
      }}
    >
      Link Account
    </Button>
  );
};
