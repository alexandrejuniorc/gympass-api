import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile.use-case.factory'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase()

  const { user } = await getUserProfile.execute({ userId: request.user.sub })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, camelcase
  const { password_hash, ...userWithoutPassword } = user

  return reply.status(200).send({ user: userWithoutPassword })
}
