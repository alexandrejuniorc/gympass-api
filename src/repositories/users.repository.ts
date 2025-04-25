import { Prisma, User } from '../../generated/prisma/index'

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
}
