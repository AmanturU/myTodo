const API_KEY = 'AIzaSyCGGIzsJlY7jukR14frnL5nF6iZuZXHufQ'
const SIGN_UP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`

const $emailInput = document.querySelector('.signUp_emailInput')
const $passwordInput = document.querySelector('.signUp_passwordInput')
const $registerBtn = document.querySelector('.signUp_registerButton')
const $formAccRegister = document.querySelector('#signUp_formAccRegister')



async function signUp(email, password) {
   $registerBtn.disabled = true
   try {
      const body = {
         email,
         password,
         returnSecureToken: true,
      }

      const response = await fetch(SIGN_UP_URL, {
         method: 'POST',
         body: JSON.stringify(body),
      })

      const res = await response.json()

      if (response.ok) {
         window.open('../html/signIn.html', '_self')
      } else {
         throw new Error(res.error.errors.at(0).message)
      }

   } catch (e) {
      alert(e)
   } finally {
      $registerBtn.disabled = false
      $emailInput.value = ''
      $passwordInput.value = ''
   }
}



$formAccRegister.addEventListener('submit', (event) => {
   event.preventDefault()

   if ($emailInput.validity.valid && $passwordInput.validity.valid) {
      signUp($emailInput.value, $passwordInput.value)

   }
})


window.addEventListener('DOMContentLoaded', () => {
   const localId = localStorage.getItem('localId')

   if (localId) {
      window.open('../html/index.html', '_self')
   }
})