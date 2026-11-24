import { validateLogin, validateRegister } from '../utils/validators.js'
import {
  showErrors,
  clearErrors,
  showMessage,
  toggleForm,
  togglePassword,
} from '../utils/ui.js'

const toggleButtons = document.querySelectorAll('.btn-toggle')
const infoSection = document.querySelector('.info-section')
const loginForm = document.querySelector('#login')
const registerForm = document.querySelector('#register')
const passwordButtons = document.querySelectorAll('.btn-password')

toggleButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    toggleForm(infoSection, loginForm, registerForm)
  })
})

passwordButtons.forEach((btn) => {
  const input = document.getElementById(btn.getAttribute('aria-controls'))

  btn.addEventListener('click', () => {
    togglePassword(btn, input)
  })
})

function removePasswords(data) {
  const result = {}

  for (const key in data) {
    if (key !== 'user-password' && key !== 'user-password-confirm') {
      result[key] = data[key]
    }
  }

  return result
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  clearErrors(loginForm)
  showMessage(loginForm, '')

  const data = Object.fromEntries(new FormData(loginForm))
  const errors = validateLogin(data)

  if (Object.keys(errors).length > 0) {
    showErrors(loginForm, errors)
    return
  }

  console.log('Inicio de sesión:', removePasswords(data))
  showMessage(
    loginForm,
    '¡Bienvenido de nuevo! Iniciaste sesión correctamente.',
  )
  loginForm.reset()
})

registerForm.addEventListener('submit', (e) => {
  e.preventDefault()

  clearErrors(registerForm)
  showMessage(registerForm, '')

  const data = Object.fromEntries(new FormData(registerForm))
  const errors = validateRegister(data)

  if (Object.keys(errors).length > 0) {
    showErrors(registerForm, errors)
    return
  }

  console.log('Registro:', removePasswords(data))
  showMessage(registerForm, '¡Tu cuenta se creó correctamente!')
  registerForm.reset()
})
