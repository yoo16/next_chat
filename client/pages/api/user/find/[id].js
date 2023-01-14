import { PrismaClient } from '@prisma/client'

const handler = async (req, res) => {
    const prisma = new PrismaClient()
    const id = parseInt(req.query.id)
    const user = await prisma.users.findUnique({
        where: {
            id: id
        }
    })
    res.json(user)
}

export default handler