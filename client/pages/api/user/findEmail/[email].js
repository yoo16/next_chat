import { PrismaClient } from '@prisma/client'

const handler = async (req, res) => {
    const prisma = new PrismaClient()
    const user = await prisma.users.findUnique({ 
        where: { 
            email: req.query.email 
        } 
    })
    res.json(user)
}

export default handler