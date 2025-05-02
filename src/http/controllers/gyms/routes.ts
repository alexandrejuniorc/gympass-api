import { verifyJWT } from '@/http/middlewares/verify-jwt.middleware'
import { FastifyInstance } from 'fastify'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)
}
