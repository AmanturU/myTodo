const API_KEY = 'AIzaSyCGGIzsJlY7jukR14frnL5nF6iZuZXHufQ'
const SIGH_IN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`

const $signIn_emailInput = document.querySelector('.signIn_emailInput')
const $signIn_passwordInput = document.querySelector('.signIn_passwordInput')
const $signIn_registerBtn = document.querySelector('.signIn_registerButton')
const $signIn_formAccRegister = document.querySelector('#signIn_formAccRegister')



async function sighIn(email, password) {
   $signIn_registerBtn.disabled = true

   try {
      const body = {
         email,
         password,
         returnSecureToken: true,
      }

      const response = await fetch(SIGH_IN_URL, {
         method: 'POST',
         body: JSON.stringify(body),
      })

      const res = await response.json()

      if (response.ok) {
         localStorage.setItem('localId', res.localId)
         window.open('../html/index.html', '_self')

      } else {
         throw new Error(res.error.errors.at(0).message)
      }

   } catch (e) {
      alert(e)
   } finally {
      $signIn_registerBtn.disabled = false
      $signIn_emailInput.value = ''
      $signIn_passwordInput.value = ''
   }
}

$signIn_formAccRegister.addEventListener('submit', (event) => {
   event.preventDefault()

   if ($signIn_emailInput.validity.valid && $signIn_passwordInput.validity.valid) {
      sighIn($signIn_emailInput.value, $signIn_passwordInput.value)

   }
})

window.addEventListener('DOMContentLoaded', () => {
   const localId = localStorage.getItem('localId')

   if (localId) {
      window.open('../html/index.html', '_self')
   }
})