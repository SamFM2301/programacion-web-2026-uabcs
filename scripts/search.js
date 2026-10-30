const searchForm = document.querySelector('.search')
const searchInput = document.querySelector('.search__field--topic .search__input')

const suggestions = document.createElement('datalist')
suggestions.id = 'search-suggestions'

document.querySelectorAll('.categories__chips .chip').forEach((chip) => {
  const topic = chip.textContent.trim()
  if (topic === 'Todas') return

  const option = document.createElement('option')
  option.value = topic
  suggestions.append(option)
})

searchForm.append(suggestions)
searchInput.setAttribute('list', suggestions.id)

searchInput.addEventListener('input', (e) => {
  const text = e.target.value.toLowerCase()

  document.querySelectorAll('.step-card').forEach((card) => {
    const matches = card.textContent.toLowerCase().includes(text)

    card.hidden = !matches
    card.style.display = matches ? '' : 'none'
  })
})

