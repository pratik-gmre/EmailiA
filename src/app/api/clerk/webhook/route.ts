import prisma from "@/libs/db";

export const POST =  async(req:Request)=>{
    const {data} = await req.json()
    console.log("clerk webhook received",data);
    const emailAddress = "ghimireprateec1@gmail.com"
    const firstName = data.first_name
    const lastName = data.last_name
    const id = data.id


    await prisma.user.create({
        data:{
            id:id,
            emailAddress:emailAddress,
            firstName:firstName,
            lastName:lastName

        }
    })
    return new Response("Webhook received",{status:200})
    
}