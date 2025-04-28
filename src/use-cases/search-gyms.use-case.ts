import { Gym } from 'generated/prisma'
import { GymsRepository } from '@/repositories/gyms.repository'

interface SearchGymsUseCaseRequest {
  query: string
  page: number
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[]
}

// SOLID
// D - Dependency Inversion Principle

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) { }

  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findMany(query, page)

    return { gyms }
  }
}
