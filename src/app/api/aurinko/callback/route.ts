import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/libs/db";
export const GET = async (req: NextRequest) => {
  const { userId } = await auth();

  if (!userId) return NextResponse.json({ msg: "Unauthorized" });

  const params = req.nextUrl.searchParams;

  const status = params.get("status");
  if (status != "success")
    return NextResponse.json({ msg: "failed to link account" });
  //get code to exchagne for token
  const code = params.get("code");
  if (code != "code")
    return NextResponse.json({ msg: "failed to link account" });

  const token = await exchangeCodeForToken(code);
  if (!token) {
    return NextResponse.json({ msg: "failed to access token" });
  }
  console.log("This is token", token);

  const accountDetails = await getAccountDetail(token.accessToken);
  if (!accountDetails) {
    return NextResponse.json({ msg: "failed to get account details" });
  }
  console.log("This is account details", accountDetails);

  await prisma.account.upsert({
    where: {
      id: token.accountId.toString(),
    },
    update: {
      accessToken: token.accessToken,
    },
    create: {
      id: token.accountId.toString(),
      userId: userId,
      emailAddress: accountDetails.email,
      name: accountDetails.name,
      accessToken: token.accessToken,
    },
  });


  return NextResponse.redirect(new URL ('/mail',req.url))
};

export const exchangeCodeForToken = async (code: string) => {
  try {
    const response = await axios.post(
      `https://api.aurinko.io/v1/auth/token/${code}`,
      {},
      {
        auth: {
          username: process.env.AURINKO_CLIENT_ID!,
          password: process.env.AURINKO_CLIENT_SECRET!,
        },
      }
    );

    return response.data as {
      accountId: number;
      accessToken: string;
      userId: string;
      userSession: string;
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data);
    }
    throw new Error("failed to exchange code for token");
  }
};

export const getAccountDetail = async (accessToken: string) => {
  try {
    const response = await axios.get("https://api.aurinko.io/v1/account", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data as {
      email: string;
      name: string;
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data);
    }
    throw new Error("Failed to get account detail");
  }
};
