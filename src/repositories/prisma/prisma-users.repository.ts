import { prisma } from '@/lib/prisma'
import { Prisma } from 'generated/prisma'
import { UsersRepository } from '../users.repository'

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({ data })

    return user
  }
}
