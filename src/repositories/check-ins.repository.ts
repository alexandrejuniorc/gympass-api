import { CheckIn, Prisma } from '../../generated/prisma/index'

export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
}
