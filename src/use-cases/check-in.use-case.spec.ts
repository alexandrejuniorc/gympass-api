import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins.repository'
import { CheckInUseCase } from './check-in.use-case'

// Unit testing

let checkInRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 12, 0, 0)) // 2023-01-01 12:00:00

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    console.log(checkIn.created_at)

    expect(checkIn.id).toEqual(expect.any(String))
  })

  // TDD -> Test Driven Development
  // RED -> GREEN -> REFACTOR
  // RED -> write a test that fails
  // GREEN -> write the minimum code to make the test pass
  // REFACTOR -> improve the code without changing its behavior

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 12, 0, 0)) // 2023-01-01 12:00:00

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 12, 0, 0)) // 2023-01-01 12:00:00

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    vi.setSystemTime(new Date(2023, 0, 2, 12, 0, 0)) // 2023-01-02 12:00:00

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
