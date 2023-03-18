const $themeSelector = document.querySelector('.themeSelector')

const THEMES = [
   {
      id: 1,
      title: 'Light',
      value: 'light',
      color: '#ECF0F1'
   },
   {
      id: 2,
      title: 'Dark',
      value: 'dark',
      color: '##273746'
   },
   {
      id: 3,
      title: 'Primary',
      value: 'primary',
      color: '#148F77'
   },

]

window.addEventListener('load', () => {
   THEMES.forEach(theme => {
      $themeSelector.insertAdjacentHTML('beforeend', optionTemplate(theme))
   })
})

window.addEventListener('load', () => {
   const theme = localStorage.getItem('theme')
   const currentTheme = getCurrentTheme(THEMES, theme)
   $themeSelector.value = theme

   setTheme(theme)
})


$themeSelector.addEventListener('change', (event) => {
   const value = event.target.value

   localStorage.setItem('theme', value)

   setTheme(value)
})


function optionTemplate(theme) {
   return `
   <option value="${theme.value}">${theme.title}</option>
   `
}

function getCurrentTheme(THEMES, value) {
   return THEMES.find(theme => theme.value === value) || null
}

function setTheme(theme) {
   document.documentElement.className = theme
}