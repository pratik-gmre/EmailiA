import { LinkAccountButton } from "@/components/link-account-button";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async()=>{
const {userId} =  await auth()
if(!userId) {
  redirect('/sign-in')
}
  return <LinkAccountButton />
}
export default Page