const menuBtn = document.querySelector('.header__menu-btn')
const nav = document.getElementById('header-nav')

menuBtn.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('header__nav--open')

  menuBtn.setAttribute('aria-expanded', isOpen)
  menuBtn.setAttribute('aria-label', isOpen ? 'Cerrar menu' : 'Abrir menu')
})
