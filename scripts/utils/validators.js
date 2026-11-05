export function isRequired(value) {
  if (value === undefined || value === null) {
    return false
  }
  return String(value).trim() !== ''
}

export function isValidEmail(value) {
  return /^\S+@\S+\.\S+$/.test(value)
}

export function hasMinLength(value, min) {
  return String(value).trim().length >= min
}

export function isValidPhone(value) {
  const digitsOnly = String(value).replace(/\s/g, '')
  return /^\d{10}$/.test(digitsOnly)
}

export function isStrongPassword(value) {
  return (
    value.length >= 8 &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /\d/.test(value)
  )
}

export function isAdult(date, minAge) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false
  }

  const parts = date.split('-')
  const year = Number(parts[0])
  const month = Number(parts[1])
  const day = Number(parts[2])

  const today = new Date()
  let age = today.getFullYear() - year

  const currentMonth = today.getMonth() + 1
  const currentDay = today.getDate()

  if (currentMonth < month || (currentMonth === month && currentDay < day)) {
    age = age - 1
  }

  return age >= minAge
}

export function validateLogin(data) {
  const errors = {}

  if (!isRequired(data['user-email'])) {
    errors['user-email'] = 'El correo electrónico es obligatorio.'
  } else if (!isValidEmail(data['user-email'])) {
    errors['user-email'] =
      'Escribe un correo válido, por ejemplo ejemplo@correo.com.'
  }

  if (!isRequired(data['user-password'])) {
    errors['user-password'] = 'La contraseña es obligatoria.'
  }

  return errors
}

export function validateRegister(data) {
  const errors = {}

  if (!isRequired(data['user-name'])) {
    errors['user-name'] = 'El nombre es obligatorio.'
  } else if (!hasMinLength(data['user-name'], 2)) {
    errors['user-name'] = 'El nombre debe tener al menos 2 letras.'
  }

  if (!isRequired(data['user-lastname'])) {
    errors['user-lastname'] = 'Los apellidos son obligatorios.'
  } else if (!hasMinLength(data['user-lastname'], 2)) {
    errors['user-lastname'] = 'Los apellidos deben tener al menos 2 letras.'
  }

  if (!isRequired(data['user-birthdate'])) {
    errors['user-birthdate'] = 'La fecha de nacimiento es obligatoria.'
  } else if (!isAdult(data['user-birthdate'], 18)) {
    errors['user-birthdate'] = 'Debes tener 18 años o más para registrarte.'
  }

  if (!isRequired(data['user-sex'])) {
    errors['user-sex'] = 'Selecciona una opción.'
  }

  if (!isRequired(data['user-email'])) {
    errors['user-email'] = 'El correo electrónico es obligatorio.'
  } else if (!isValidEmail(data['user-email'])) {
    errors['user-email'] =
      'Escribe un correo válido, por ejemplo ejemplo@correo.com.'
  }

  if (!isRequired(data['user-phone'])) {
    errors['user-phone'] = 'El teléfono es obligatorio.'
  } else if (!isValidPhone(data['user-phone'])) {
    errors['user-phone'] = 'El teléfono debe tener 10 dígitos.'
  }

  if (!isRequired(data['user-password'])) {
    errors['user-password'] = 'La contraseña es obligatoria.'
  } else if (!isStrongPassword(data['user-password'])) {
    errors['user-password'] =
      'Usa mínimo 8 caracteres, con una mayúscula, una minúscula y un número.'
  }

  if (!isRequired(data['user-password-confirm'])) {
    errors['user-password-confirm'] = 'Confirma tu contraseña.'
  } else if (data['user-password-confirm'] !== data['user-password']) {
    errors['user-password-confirm'] = 'Las contraseñas no coinciden.'
  }

  if (data['accept-privacy'] !== 'yes') {
    errors['accept-privacy'] =
      'Debes aceptar el Aviso de Privacidad para continuar.'
  }

  return errors
}
