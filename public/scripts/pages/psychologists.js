import Swal from '../../vendor/sweetalert2/sweetalert2.esm.all.min.js'
import { validatePsychologist } from '../utils/validators.js'
import { showErrors, clearErrors } from '../utils/ui.js'

const API_URL = '../api/psychologists.php'

const status = document.querySelector('#status')
const list = document.querySelector('#psychologists')
const form = document.querySelector('#register-form')

function createCard(psychologist) {
  const card = document.createElement('li')
  card.className = 'card'

  const name = document.createElement('h2')
  name.className = 'card__name'
  name.textContent = psychologist.name

  const specialty = document.createElement('p')
  specialty.className = 'card__specialty'
  specialty.textContent = psychologist.specialty

  const details = [
    `Modalidad: ${psychologist.modality}`,
    `Ciudad: ${psychologist.city}`,
    `Precio por sesión: $${psychologist.price} MXN`,
  ].map((text) => {
    const detail = document.createElement('p')
    detail.className = 'card__detail'
    detail.textContent = text
    return detail
  })

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'card__button'
  button.textContent = 'Agendar cita'
  button.addEventListener('click', () => confirmAppointment(psychologist))

  card.append(name, specialty, ...details, button)
  return card
}

async function confirmAppointment(psychologist) {
  const result = await Swal.fire({
    title: '¿Agendar cita?',
    text: `Vas a agendar una cita con ${psychologist.name} por $${psychologist.price} MXN.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, agendar',
    cancelButtonText: 'Cancelar',
  })

  if (result.isConfirmed) {
    Swal.fire({
      title: '¡Cita agendada!',
      text: `Tu cita con ${psychologist.name} quedó registrada.`,
      icon: 'success',
    })
  }
}

async function loadPsychologists() {
  status.textContent = 'Cargando psicólogos...'
  status.classList.remove('status--error')

  try {
    const response = await fetch(API_URL)

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`)
    }

    const psychologists = await response.json()

    list.replaceChildren(...psychologists.map(createCard))
    status.textContent = ''
  } catch (error) {
    console.error('No se pudieron cargar los psicólogos:', error)

    status.textContent =
      'No pudimos cargar la lista de psicólogos. Inténtalo de nuevo más tarde.'
    status.classList.add('status--error')

    Swal.fire({
      title: 'Error al cargar',
      text: 'No pudimos obtener la lista de psicólogos. Revisa tu conexión e inténtalo de nuevo.',
      icon: 'error',
    })
  }
}

async function registerPsychologist(event) {
  event.preventDefault()
  clearErrors(form)

  const data = Object.fromEntries(new FormData(form))
  const errors = validatePsychologist(data)
  if (Object.keys(errors).length > 0) {
    showErrors(form, errors)
    return
  }

  const submit = form.querySelector('[type="submit"]')
  submit.disabled = true

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, price: Number(data.price) }),
    })

    const body = await response.json()

    if (response.status === 422) {
      if (body.fields) {
        showErrors(form, body.fields)
      }
      Swal.fire({ title: 'Datos inválidos', text: body.error, icon: 'warning' })
      return
    }

    if (!response.ok) {
      throw new Error(body.error || `Error HTTP ${response.status}`)
    }
    list.append(createCard(body))
    form.reset()

    Swal.fire({
      title: '¡Registrado!',
      text: `${body.name} ya aparece en la lista.`,
      icon: 'success',
    })
  } catch (error) {
    console.error('No se pudo registrar el psicólogo:', error)

    Swal.fire({
      title: 'Error al registrar',
      text: 'No pudimos guardar el psicólogo. Inténtalo de nuevo más tarde.',
      icon: 'error',
    })
  } finally {
    submit.disabled = false
  }
}

form.addEventListener('submit', registerPsychologist)
loadPsychologists()
