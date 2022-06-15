import { createAuthRepository } from '../domain/factories/authRepositoryFactory.js'
import { AuthRepository } from '../domain/repositories/authRepository.js'

const loginButton = document.getElementById('login-button') as HTMLButtonElement
const loginInput = document.getElementById('login') as HTMLInputElement
const passwordInput = document.getElementById('senha') as HTMLInputElement
const apiKeyInput = document.getElementById('api-key') as HTMLInputElement

let username: string
let password: string
let apiKey: string

const authRepository = createAuthRepository()

loginInput.addEventListener('input', () => {
    username =  loginInput.value;
    validateLoginButton();
})

passwordInput.addEventListener('input', () => {
  password = passwordInput.value;
  validateLoginButton();
})

apiKeyInput.addEventListener('input', () => {
  apiKey = apiKeyInput.value;
  validateLoginButton();
})

function validateLoginButton() {
  const loginFormIsValid = !!password && !!username && !!apiKey
  
  loginButton.disabled = !loginFormIsValid
}

function limparFormulario() {
  loginInput.value = ''
  passwordInput.value = ''
  apiKeyInput.value = ''
  validateLoginButton()
}

loginButton.addEventListener('click', async () => {
  try {
    await authRepository.logar(username, password, apiKey)
    limparFormulario()
    alert('Login realizado com sucesso!')
  } catch (e) {
    alert('Ocorreu um erro ao realizar o login. Verifique seu usuário/senha/apiKey e tente novamente')
  }
})
