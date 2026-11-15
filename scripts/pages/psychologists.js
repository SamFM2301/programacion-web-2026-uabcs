import Swal from '../../node_modules/sweetalert2/dist/sweetalert2.esm.all.min.js'

const DATA_URL = '../data/psychologists.json'

const status = document.querySelector('#status')
const list = document.querySelector('#psychologists')

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
    `Experiencia: ${psychologist.experience} años`,
    `Calificación: ${psychologist.rating} / 5`,
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
    const response = await fetch(DATA_URL)

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`)
    }

    const psychologists = await response.json()

    list.append(...psychologists.map(createCard))
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

loadPsychologists()
