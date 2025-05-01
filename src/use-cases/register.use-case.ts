import { UsersRepository } from '@/repositories/users.repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists.error'
import { User } from '@prisma/client'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

// SOLID
// D - Dependency Inversion Principle

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    email,
    name,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const SALT_ROUNDS = 6
    const passwordHash = await hash(password, SALT_ROUNDS)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    })

    return { user }
  }
}
