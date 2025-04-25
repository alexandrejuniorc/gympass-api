import { Prisma } from 'generated/prisma'

export class PrismaUsersRepository {
  public users: Prisma.UserCreateInput[] = []

  async create(data: Prisma.UserCreateInput) {
    this.users.push(data)
  }
}
