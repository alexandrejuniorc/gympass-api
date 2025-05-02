// @vitest-environment prisma

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Gym Controller (E2E)', () => {
  beforeAll(async () => {
    // Ensure the application has been initialized
    await app.ready()
  })
  afterAll(async () => {
    // Ensure the application is closed after the tests
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gymResponse = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript Gym',
        description: 'Some description.',
        phone: '99999999999',
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    expect(gymResponse.statusCode).toEqual(201)
  })
})
