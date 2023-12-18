'use strict';

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";
let globalActiveHabbitId

// page
const page = {
  menu: document.querySelector('.btns_habbit'),
  header: {
    title: document.querySelector('.title_page'),
    num_progres: document.querySelector('.num_progres'),
    line_active: document.querySelector('.line_active')
  },
  comment: {
    coverComment: document.querySelector('.info_flex'),
    commentInfo: document.querySelector('.info'),
    text_comment: document.querySelector('.title_info_text'),
    count_day_input: document.querySelector('.count_day_input')
  },
  popup: {
    index: document.getElementById('modal'),
    inputHidden: document.querySelector('[name="input_hidden_icon"]'),
    inputTitle: document.querySelector('[name="input_title_icon"]'),
    inputTarget: document.querySelector('[name="input_target_icon"]')
} 
}

// itils
function loadData() {
  const habbitsString = localStorage.getItem(HABBIT_KEY)
  habbits = JSON.parse(habbitsString)
}
function saveData() {
  localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits))
}

// render
function rerenderMenu(activeHabbit) {
  for (const habbit of habbits) {
    const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`)
    if (!existed) {
      // add
      const element = document.createElement('div')
      element.setAttribute('menu-habbit-id', `${habbit.id}`)
      element.classList.add('push')
      element.innerHTML = `<img src="./img/${habbit.icon}.svg" alt="${habbit.name}" draggable="false">`
      element.addEventListener('click', (e) => rerender(habbit.id))
      if (activeHabbit.id === habbit.id) {
        element.classList.add('push_active')
      }
      page.menu.appendChild(element)
      continue;
    } 
    if (activeHabbit.id === habbit.id) {
      existed.classList.add('push_active')
    } else {
      existed.classList.remove('push_active')
    }
  }
}

function rerenderHeader(activeHabbit) {
  page.header.title.innerHTML = activeHabbit.name
  const resNumProgres =  Number(activeHabbit.days.length) / Number(activeHabbit.target) > 1
  ? 100
  : Number(activeHabbit.days.length) / Number(activeHabbit.target) * 100
  page.header.num_progres.innerText = resNumProgres.toFixed(0)
  page.header.line_active.style.width = `${resNumProgres.toFixed(0)}%`
}

function rerenderComment(activeHabbit) {     
  page.comment.coverComment.innerHTML = ''
  const countInfoActive = activeHabbit.days.length 
  let countIteration = 0
  const existedCommet = document.querySelector(`[comment-habbit]`)
  if (!existedCommet) {
    // creat
    for (countInfoActive, countIteration; countIteration < countInfoActive; countIteration++) {
      const elementInfo = document.createElement('div') 
      elementInfo.classList.add('info')
      elementInfo.classList.add('info_day')
      elementInfo.setAttribute('comment-habbit', activeHabbit.id)
      elementInfo.innerHTML = `<div class="day day_dinamic">
        <h2 class="text_day">День <span class="count_day">${countIteration + 1}</span></h2>
      </div>
      <div class="title_info">
        <h3 class="title_info_text">${activeHabbit.days[countIteration].comment}</h3> 
        <div class="delete_svg">
          <button class="btn_del" onclick="deletDay(${countIteration})" num-form="${countIteration + 1}">
            <div num-form="${countIteration + 1}">
              <img class="img_del" src="./img/del.svg">
            </div>
          </button>  
        </div>             
      </div>`
      page.comment.coverComment.appendChild(elementInfo)
    }
    page.comment.count_day_input.innerText = `${activeHabbit.days.length + 1}` 
  } 
}

function rerender (activeHabbitId) { 
  globalActiveHabbitId = activeHabbitId
  const activeHabbit = habbits.find(el => el.id === activeHabbitId)
  if (!activeHabbit) {
    return
  }
  document.location.replace(document.location.pathname + '#' + activeHabbitId)  
  rerenderMenu(activeHabbit)
  rerenderHeader(activeHabbit)
  rerenderComment(activeHabbit)
}

// init
(() => {
  loadData();
  if (habbits === null) {
    togglePopup()
  } else {
    const hashId = Number(document.location.hash.replace('#', ''))
    const urlHabbit = habbits.find(habbit => hashId === habbit.id)
    if (urlHabbit) {
      rerender(urlHabbit.id)
    } else {
      rerender(habbits[0].id)
    }
  }
})();

//add day
function addDay(e) {
  e.preventDefault()
  const data = new FormData(e.target)
  const form = e.target
  const comment = data.get('value_comment') 
  if (comment === '') {
    return
  }
  console.log('прошли')
  habbits = habbits.map(habbit => {
    if (globalActiveHabbitId === habbit.id) {
      return {
        ...habbit,
        days: habbit.days.concat([{ comment }])
      }
    }
    return habbit
  })
  e.target.value_comment.value = ''
  rerender(globalActiveHabbitId)
  saveData()
}

// delet day
function deletDay(index) {
  habbits = habbits.map(habbit => { 
    if (habbit.id === globalActiveHabbitId) {
      habbit.days.splice(index, 1)
    }
    return habbit
  })
  rerender(globalActiveHabbitId)
  saveData()
}
//work popup
function setIcon(context, icon) {
  page.popup.inputHidden.value = icon
  const activeIcon = document.querySelector('.push_modal.push_active_modal')
  activeIcon.classList.remove('push_active_modal')
  context.classList.add('push_active_modal')
}
//add habbit
function addHabbit(e) {
  e.preventDefault()
  const data = new FormData(e.target)
  const inputIcon = data.get('input_hidden_icon')
  const inputTitle = data.get('input_title_habbit')
  const inputTarget = data.get('input_target_habbit')
  if (inputIcon === '' || inputTarget === '' || inputTitle === '') {
    return
  }
  if (habbits === null) {
    habbits = [{id:1, icon:inputIcon, name:inputTitle, target: inputTarget, days:[]}]
    saveData()
    rerender(1)
    // console.log(habbits[0].id)
    togglePopup()
  } else {
    const id = habbits.length + 1
    habbits.push({id:id, icon:inputIcon, name:inputTitle, target: inputTarget, days:[]})
    rerender(globalActiveHabbitId)
    saveData()
    togglePopup()
  }
}

// popup
function togglePopup() {
  if (!page.popup.index.classList.contains('modal_active')) {
    page.popup.index.classList.add('modal_active')
    page.popup.index.classList.remove('modal_hidden')
  } else if (habbits === null){
    const inputTitle = document.querySelector('[name="input_title_habbit"]')
    const inputTarget = document.querySelector('[name="input_target_habbit"]')
    inputTitle.classList.add('field')
    inputTarget.classList.add('field')
    console.log(inputTitle)
  } else {
    page.popup.index.classList.remove('modal_active')
    page.popup.index.classList.add('modal_hidden')
  }
}