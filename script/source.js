const $title = document.querySelector('.titleInput');
const $description = document.querySelector('.descriptionInput');
const $addBtn = document.querySelector('.addBtn')
const $cardsContainer = document.querySelector('.todos')
const $formNoteCreate = document.querySelector('#formNoteCreate')
const $todoRadioBtn = document.querySelector('#todoRadioBtn')

const $titleCategoryInput = document.querySelector('#titleCategoryInput')
const $categoryAddBtn = document.querySelector('#categoryAddBtn')
const $categorySelect = document.querySelector('#categorySelect')
const $formCategoryCreate = document.querySelector('#formCategoryCreate')

const $signOutBtn = document.querySelector('.signOutBtn')

const $categoryFilter = document.querySelector('#category-filter')

const nowTime = new Date();
let notesArray = []

const BASE_URL = 'https://mytodo-01-default-rtdb.asia-southeast1.firebasedatabase.app'

const $notes = document.querySelectorAll('.todoCard')

// ----Загрузка заметок при обновлении сайта
window.addEventListener('load', () => {
   getTodosRequest()

   const category = getСategory()



   category.reverse().forEach(category => {
      $categorySelect.insertAdjacentHTML('afterbegin', `<option value="${category.id}">${category.title}</option>`)
      $categoryFilter.insertAdjacentHTML('beforeend', `<option value="${category.id}">${category.title}</option>`)
   })

   $categoryFilter.addEventListener('change', () => {
      const selectedCategory = $categoryFilter.value
      const filteredTodos = filterNotesByCategory(todos, selectedCategory)
      $cardsContainer.innerHTML = filteredTodos.map(todo => cardTemplate(todo))
   })
})

function filterNotesByCategory(todos, category) {
   return todos.filter(todo => category === 'all' || todo.category === category)
}

// -----------Логика создание заметки-----------------
$formNoteCreate.addEventListener('submit', (event) => {
   event.preventDefault();
   const noteCreatedTime = timeNotesCreated()


   if ($title.validity.valid && $description.validity.valid) {
      createTodo({ title: $title.value, description: $description.value, category: $categorySelect.value })
   }
})


$formCategoryCreate.addEventListener('submit', (event) => {
   event.preventDefault()


   if ($titleCategoryInput.validity.valid) {
      createCategory({ title: $titleCategoryInput.value })
   }
})

// -----------Фильтрация заметок-----------------



// --------------Шаблон карторчек------------------
function cardTemplate(todo) {
   const {
      title,
      description,
      id,
      timeCreated,
      completed,
      editedAt,
      category,
   } = todo
   const categories = getСategory()

   const findCategory = categories.find(ctg => ctg.id === +category)

   return `
   <div class="todoCard my-scrollbar ${completed ? 'completed' : ''}" data-categoryId="${category}">
      <div class="titleTodoCard">
      <label for="todo1" class="todoTitle"><input type="radio" id="todoRadioBtn" onclick="completeTodo('${id}', ${completed})" name="todoRadioBtn"
      class="todoCheckbox">${title}</label>

      <div class="timeBlock">
      <span class="category" onclick="openCategoryModal(${category}) ">Category: ${findCategory.title}</span>
      <span>Created: ${timeCreated}</span>
      ${editedAt ? `<span>Edited at: ${editedAt}</span>` : ''
      }
      </div>

      </div>
      <div>
      <p>${description}</p>


      </div>
      <div class="cardIcons">
      <button class="editBtn" onclick="editTodo('${id}', '${title}', '${description}')"><i class="fa fa-pencil"></i></button>
      <button class="deleteBtn" onclick="deleteTodo('${id}')"><i class="fa fa-trash"></i></button>
      
      </div>
   </div>
`
}

// --------------Шаблок заметок lS--------------
async function createTodo({ title, description, category }) {
   try {
      const todo = {
         title: title.trim() || "Untitled",
         description: description.trim() || "No description",
         timeCreated: timeNotesCreated(),
         editedAt: null,
         completed: false,
         category
      }

      await fetch(`${BASE_URL}/todos.json`, {
         method: 'POST',
         body: JSON.stringify(todo),
      })

      resetFields()
      $cardsContainer.insertAdjacentHTML('afterbegin', cardTemplate(todo))
   } catch (e) {
      console.error(e)
   }

}

async function getTodosRequest() {
   try {
      const response = await fetch(`${BASE_URL}/todos.json`)

      const todos = await response.json()


      const todosArray = Object.entries(todos).map(([id, val]) => {
         return {
            id,
            ...val
         }
      })
      const template = todosArray.reverse().reduce((acc, todo) => acc + cardTemplate(todo), '')

      $cardsContainer.innerHTML = template

   } catch (e) {
      console.error(e)
   }
}


// ---------- Категории в ls-----------
function createCategory({ title }) {
   const currentCategory = getСategory()

   const category = {
      id: generateIdForCategory(),
      title: title.trim() || "Untitled",
   }

   setСategory([...currentCategory, category])


   resetCategoryFields()
   reloadPage()
}
// -------------Функция для получение todos из lS
function getTodos(todos) {
   return JSON.parse(localStorage.getItem('todos')) || []
}


// Завершенние заметки
async function completeTodo(id, completed) {

   try {
      await fetch(`${BASE_URL}/todos/${id}.json`, {
         method: 'PATCH',
         body: JSON.stringify({
            completed: !completed,
         })
      })

      await getTodosRequest()
   } catch (e) {
      console.error(e)
   }

}

// Удаление заметки
async function deleteTodo(id) {
   try {
      const confirmDelete = confirm('Do you confirm that you want to delete the note?')
      if (!confirmDelete) return

      await fetch(`${BASE_URL}/todos/${id}.json`, {
         method: 'DELETE'
      })

      await getTodosRequest()

   } catch (e) {
      console.error(e)
   }
}


async function editTodo(id, title, description) {
   try {
      await fetch(`${BASE_URL}/todos/${id}.json`, {
         method: 'PATCH',
         body: JSON.stringify({
            title: prompt('Write your new title:', title) || title,
            description: prompt('Write your new description:', description) || description,
            editedAt: timeNotesCreated(),
         })
      })

      await getTodosRequest()
   } catch (e) {
      console.error(e)
   }

}



// -------------Время создание заметки-------------
function timeNotesCreated() {
   return `${nowTime.getDate()}.0${nowTime.getMonth() + 1}.${nowTime.getFullYear()} ${nowTime.getHours()}:${nowTime.getMinutes()}`
}

// -------------Сброс input'ов----------------
function resetFields() {
   $title.value = ''
   $description.value = ''
}

function resetCategoryFields(title) {
   title = ''
}




// ----------------Генератор id--------------
function generateId() {
   const todos = getTodos()

   const maxID = todos.reduce((acc, todo) => todo.id > acc ? todo.id : acc, 0)

   return maxID + 1
}

function generateIdForCategory() {
   const category = getСategory()

   const maxID = category.reduce((acc, category) => category.id > acc ? category.id : acc, 0)

   return maxID + 1
}

// --------- Получение title категории с помощью id
function getCategoryTitleById(id) {
   const category = getСategory().find((item) => item.id === id)
   if (category) {
      return category.title
   }
   return "Untitled"
}

// -------------Функция сохранения заметки в localStorage----------
function setTodos(todos) {
   localStorage.setItem('todos', JSON.stringify(todos))
}
// -------------Функция для получение Сategory из lS
function getСategory() {
   return JSON.parse(localStorage.getItem('category')) || []
}
// ------ Сохранение катерий в lS----------------
function setСategory(category) {
   localStorage.setItem('category', JSON.stringify(category))
}


// --------------Radio Input---------------
// $todoRadioBtn.addEventListener('click', () => {
//    if (radioBtn.checked) {
//       radioBtn.checked = false
//    } else {
//       radioBtn.checked = true
//    }
// })

// ---------Функция для обновления страницы----
function reloadPage() {
   window.location.reload()
}


/* --------------------------===>Check auth<===-------------------------- */

window.addEventListener('DOMContentLoaded', () => {
   const localId = localStorage.getItem('localId')

   if (!localId) {
      window.open('../html/signIn.html', '_self')
   }
})

/* --------------------------===>Sign out btn function<===-------------------------- */
$signOutBtn.addEventListener('click', () => {
   alert('Всё робит')
   localStorage.removeItem('localId')
   window.open('../html/signIn.html', '_self')
})