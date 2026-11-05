export function showError(form, name, message) {
  const span = form.querySelector(`[data-error-for="${name}"]`)
  if (span) {
    span.textContent = message
  }

  const field = form.elements[name]
  if (field) {
    field.classList.add('invalid')
  }
}

export function showErrors(form, errors) {
  const names = Object.keys(errors)

  names.forEach((name) => {
    showError(form, name, errors[name])
  })

  if (names.length > 0) {
    form.elements[names[0]].focus()
  }
}

export function clearErrors(form) {
  form.querySelectorAll('[data-error-for]').forEach((span) => {
    span.textContent = ''
  })

  form.querySelectorAll('.invalid').forEach((field) => {
    field.classList.remove('invalid')
  })
}

export function showMessage(form, text) {
  const message = form.querySelector('.form-message')
  if (message) {
    message.textContent = text
  }
}

export function toggleForm(infoSection, loginForm, registerForm) {
  infoSection.classList.toggle('inverted')

  loginForm.inert = !loginForm.inert
  registerForm.inert = !registerForm.inert
}

export function togglePassword(btn, input) {
  const isHidden = input.type === 'password'

  input.type = isHidden ? 'text' : 'password'
  btn.setAttribute('aria-pressed', String(isHidden))
  btn.setAttribute(
    'aria-label',
    isHidden ? 'Ocultar contraseña' : 'Mostrar contraseña',
  )
}
