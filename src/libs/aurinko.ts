// "use server";

// import { auth } from "@clerk/nextjs/server";

// export const getAurinkoAuthUrl = async (
//   serviceType: "Google" | "Office365"
// ) => {
//   const { userId } = await auth();

//   if (!userId) throw new Error("Unauthorized");

//   const params = new URLSearchParams({
//     clientId: process.env.AURINKO_CLIENT_ID! as string,
//     serviceType,
//     scopes: "Mail.Read Mail.ReadWrite Mail.Send Mail.Draft Mail.All",
//     responseType: "code",
//     returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/aurinko/callback`,
//   });
//   console.log("this is params", params.toString());

//   return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`;
// };

"use server";

import { auth } from "@clerk/nextjs/server";


export const getAurinkoAuthUrl = async (
  serviceType: "Google" | "Office365"
) => {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const params = new URLSearchParams({
    clientId: process.env.AURINKO_CLIENT_ID!,
    accountRole: "primary", // REQUIRED for User OAuth flow
    serviceType,
    scopes: "Mail.Read Mail.Send", // Space-separated scopes
    responseType: "code",
    returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/aurinko/callback`,
    state: userId,
  });

  const authUrl = `https://api.aurinko.io/v1/auth/authorizeUser?${params.toString()}`;
  
  console.log("🔗 Auth URL:", authUrl);
  console.log("📋 Scopes being sent:", "Mail.Read Mail.Send");
  
  return authUrl;
};