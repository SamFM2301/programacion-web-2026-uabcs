const themeSwitch = document.querySelector('.theme-switch')
const root = document.documentElement

themeSwitch.addEventListener('click', () => {
  const isDark = themeSwitch.getAttribute('aria-checked') === 'true'
  const newIsDark = !isDark

  themeSwitch.setAttribute('aria-checked', newIsDark)

  if (newIsDark) {
    root.setAttribute('data-theme', 'dark')
  } else {
    root.removeAttribute('data-theme')
  }
})
