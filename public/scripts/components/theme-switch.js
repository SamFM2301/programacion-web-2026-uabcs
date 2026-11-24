import { getSavedTheme, saveTheme, applyTheme } from '../utils/theme.js'

const themeSwitch = document.querySelector('.theme-switch')

themeSwitch.setAttribute('aria-checked', getSavedTheme() === 'dark')

themeSwitch.addEventListener('click', () => {
  const isDark = themeSwitch.getAttribute('aria-checked') === 'true'
  const newTheme = isDark ? 'light' : 'dark'

  themeSwitch.setAttribute('aria-checked', newTheme === 'dark')
  applyTheme(newTheme)
  saveTheme(newTheme)
})
