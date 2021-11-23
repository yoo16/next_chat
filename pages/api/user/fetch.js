import { PrismaClient } from '@prisma/client'

const handler = async (req, res) => {
    const prisma = new PrismaClient()
    const users = await prisma.users.findMany(
        {
            orderBy: { id: "asc", },
        })
    res.json(users);
}

export default handler