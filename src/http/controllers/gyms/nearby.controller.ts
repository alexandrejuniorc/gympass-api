import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms.use-case.factory'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  // the localization needs use coerce to convert the string to a number, because all query params are strings
  const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      const isValidLatitude = Math.abs(value) <= 90
      return isValidLatitude
    }),
    longitude: z.coerce.number().refine((value) => {
      const isValidLongitude = Math.abs(value) <= 180
      return isValidLongitude
    }),
  })

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query)

  const nearbyGymsUseCase = makeFetchNearbyGymsUseCase()

  const { gyms } = await nearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({ gyms })
}
