const modal = document.querySelector("#myModal")
const $closeModalBtn = document.querySelector(".closeModal")
const $submitCategoryBtn = document.querySelector('#submitCategoryBtn')
const $editCategoryInput = document.querySelector("#editCategoryInput")
const $formCategoryCRUD = document.querySelector('.formCategoryCRUD')
const $deleteCategoryBtn = document.querySelector('#deleteCategoryBtn')

// --------Закрываем модальное окно при клике на крестик
$closeModalBtn.addEventListener("click", () => closeCategoryModal())

//---------- Закрываем модальное окно при клике за его пределами
window.addEventListener("click", event => {
   if (event.target === modal) {
      closeCategoryModal()
   }
})

//--------Разные действия при нажатии на кнопки
document.addEventListener('keydown', e => {
   if (modal.style.display === 'none') return

   if (e.key === 'Escape') {
      closeCategoryModal()
   }

})

// -----Открытие модального окна + заполнение input
function openCategoryModal(categoryID) {
   const allCategory = getСategory()

   const foundCategory = allCategory.find(category => category.id === categoryID)

   $editCategoryInput.value = foundCategory.title
   modal.style.display = 'block'

   $editCategoryInput.dataset.categoryId = categoryID

   $editCategoryInput.focus()
}

function closeCategoryModal() {
   modal.style.display = 'none'
}

// ---Действия кнопки Submit
$formCategoryCRUD.addEventListener('submit', () => {
   const categories = getСategory()

   const newCategories = categories.map(category => {
      if (category.id === +$editCategoryInput.dataset.categoryId) {
         return {
            ...category,
            title: $editCategoryInput.value
         }
      }

      return category
   })
   setСategory(newCategories)

   reloadPage()
})

// ----Действие кнопки delete
$deleteCategoryBtn.addEventListener('click', () => {
   const askCategoryDelete = confirm('Are you sure you want to delete this category and all notes attached to it?')
   console.log(1)
   if (!askCategoryDelete) return
   console.log(2)

   const categoryId = $editCategoryInput.dataset.categoryId

   const updatedCategories = getСategory().filter(category => category.id !== +categoryId)
   const newTodos = getTodos().filter(todo => todo.category !== categoryId)

   setСategory(updatedCategories)
   setTodos(newTodos)

   reloadPage()
})
