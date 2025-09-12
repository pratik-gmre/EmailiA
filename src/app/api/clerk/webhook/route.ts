import prisma from "@/libs/db";

export const POST =  async(req:Request)=>{
    const {data} = await req.json()
    console.log("clerk webhook received",data);
    const emailAddress = data.email_addresses[0].email_address
    const firstName = data.first_name
    const lastName = data.last_name
    const id = data.id
console.log("this is data",data);


    await prisma.user.create({
        data:{
            id:id,
            emailAddress:emailAddress,
            firstName:firstName,
            lastName:lastName || "ghimire"

        }
    })
    return new Response("Webhook received",{status:200})
    
}