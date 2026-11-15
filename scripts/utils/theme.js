const STORAGE_KEY = 'mente-preferences'

export function getSavedTheme() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return saved?.theme === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme }))
}

export function applyTheme(theme) {
  const root = document.documentElement

  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark')
  } else {
    root.removeAttribute('data-theme')
  }
}

// Al cargar cualquier página se aplica el tema guardado
applyTheme(getSavedTheme())
