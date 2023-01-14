// import prisma from '../../../lib/prisma';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const handler = async (req, res) => {
    const { name, email } = req.body;

    const user = await prisma.users.create({
        data: { name, email },
    })

    res.json(user);
}

export default handler
