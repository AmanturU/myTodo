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

const $categoryFilter = document.querySelector('#category-filter')

const nowTime = new Date();
let notesArray = []

const $notes = document.querySelectorAll('.todoCard')

// ----Загрузка заметок при обновлении сайта
window.addEventListener('load', () => {
   const todos = getTodos()
   const category = getСategory()

   todos.reverse().forEach(todo => {
      $cardsContainer.insertAdjacentHTML('beforeend', cardTemplate(todo))
   })

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
      <label for="todo1" class="todoTitle"><input type="radio" id="todoRadioBtn" onclick="completeTodo(${id})" name="todoRadioBtn"
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
      <button class="editBtn" onclick="editTodo(${id})"><i class="fa fa-pencil"></i></button>
      <button class="deleteBtn" onclick="deleteTodo(${id})"><i class="fa fa-trash"></i></button>
      
      </div>
   </div>
`
}

// --------------Шаблок заметок lS--------------
function createTodo({ title, description, category }) {
   const currentTodos = getTodos()

   const todo = {
      id: generateId(),
      title: title.trim() || "Untitled",
      description: description.trim() || "No description",
      timeCreated: timeNotesCreated(),
      editedAt: null,
      completed: false,
      category
   }

   setTodos([...currentTodos, todo])

   $cardsContainer.insertAdjacentHTML('afterbegin', cardTemplate(todo))

   resetFields()
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



// Завершенние заметки
function completeTodo(id) {

   const updatedTodos = getTodos().map(todo => {
      if (todo.id === id) {
         todo.completed = !todo.completed
      }
      return todo
   })

   setTodos(updatedTodos)

   reloadPage()
}

// Удаление заметки
function deleteTodo(id) {
   const confirmDelete = confirm('Do you confirm that you want to delete the note?')

   if (!confirmDelete) return

   const updatedTodos = getTodos().filter(todo => todo.id !== id)

   setTodos(updatedTodos)
   reloadPage()
}

function editTodo(id) {
   const updatedTodos = getTodos().map(todo => {
      if (todo.id === id) {
         todo.title = prompt('Write your new title:', todo.title) || todo.title
         todo.description = prompt('Write your new description:', todo.description) || todo.description
         todo.editedAt = timeNotesCreated()
      }

      return todo
   })

   setTodos(updatedTodos)
   reloadPage()
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

// -------------Функция для получение todos из lS
function getTodos() {
   return JSON.parse(localStorage.getItem('todos')) || []
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