import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym.use-case.factory'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      const isValidLatitude = Math.abs(value) <= 90
      return isValidLatitude
    }),
    longitude: z.number().refine((value) => {
      const isValidLongitude = Math.abs(value) <= 180
      return isValidLongitude
    }),
  })

  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(request.body)

  const createGymUseCase = makeCreateGymUseCase()

  await createGymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  })

  return reply.status(201).send()
}
