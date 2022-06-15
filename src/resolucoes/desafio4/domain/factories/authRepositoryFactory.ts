import { AuthRepository } from "../repositories/authRepository.js"

const authRepository = new AuthRepository()

export const createAuthRepository = () => authRepository