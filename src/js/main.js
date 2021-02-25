

// ----------- Создание сложных DOM струтур
function create(name, attributes) {
  var el = document.createElement(name);
  if (typeof attributes == 'object') {
    for (var i in attributes) {
      el.setAttribute(i, attributes[i]);

      if (i.toLowerCase() == 'class') {
        el.className = attributes[i]; // for IE compatibility

      } else if (i.toLowerCase() == 'style') {
        el.style.cssText = attributes[i]; // for IE compatibility
      }
    }
  }
  for (var i = 2; i < arguments.length; i++) {
    var val = arguments[i];
    if (typeof val == 'string') { val = document.createTextNode(val) };
    el.appendChild(val);
  }
  return el;
}
// ----------- Создание сложных DOM струтур --------- Конец


// ----------- Создание формы редактирования имен

function EditNames() {
  if (document.getElementById('editName').contains(document.querySelector('.row'))) {
    document.getElementById('editName').style.display = 'flex';
  }
  else {
    var titles = document.querySelectorAll(".product__title");
    for (var i = 0; i < titles.length; i++) {
      var row = create("div", { Class: "row" },
        create("input", { type: 'text', value: titles[i].innerHTML, name: "currentName_" + i, placeholder: titles[i].innerHTML, disabled: true }),
        create("input", { type: 'text', value: "", name: "newName_" + i, placeholder: "Новое наименование" })
      )
      document.getElementById('sendChangeName').before(row);
      document.getElementById('editName').style.display = 'flex';
    }
  }
}

function closeForm() {
  document.getElementById('editName').style.display = 'none';
}

// ----------- Создание формы редактирования имен --------- Конец


function submit() {
  var request = new XMLHttpRequest();
  request.onload = function () {
    if (request.status == 200) {
      alert("Thank you!")
    }
  };
  request.open(this.method, this.action, true);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var inputs = document.querySelectorAll('input[type="text"]');
  var sendText = "";

  for (var i = 0; i < (inputs.length / 2); i++) {
    if (this.querySelector(`[name="newName_` + `${i}"]`).value != "") {
      if (i == 0) {
        sendText += `currentName_` + `${i}=`;
      }
      else {
        sendText += `&currentName_` + `${i}=`;
      }
      sendText += encodeURIComponent(this.querySelector(`[name="currentName_` + `${i}"]`).value);
      sendText += `&newName_` + `${i}=`;
      sendText += encodeURIComponent(this.querySelector(`[name="newName_` + `${i}"]`).value);
    }
  }
  request.send(sendText);

  return false;
}


document.addEventListener("DOMContentLoaded", function () {
  var titles = document.querySelectorAll(".product__title");
  for (var i = 0; i < titles.length; i++) {
    titles[i].onclick = EditNames;
  }
  document.getElementById('btnClose').onclick = closeForm;


  var moreMenu = document.querySelectorAll(".topMenu__more");
  for (var i = 0; i < moreMenu.length; i++) {
    moreMenu[i].onclick = function () {
      this.classList.toggle('open');
      this.nextElementSibling.classList.toggle('open');
    };
  }

  var form = document.querySelector("#editName");


  form.onsubmit = submit;



  const tasksListElement = document.querySelector('.tasks__list');
  const taskElements = tasksListElement.querySelectorAll('.product');

  for (const task of taskElements) {
    task.draggable = true;
  }

  tasksListElement.addEventListener('dragstart', (evt) => {
    evt.target.classList.add('selected');
  })

  tasksListElement.addEventListener('dragend', (evt) => {
    evt.target.classList.remove('selected');
  });

  tasksListElement.addEventListener('dragover', (evt) => {
    // Разрешаем сбрасывать элементы в эту область
    evt.preventDefault();

    // Находим перемещаемый элемент
    const activeElement = tasksListElement.querySelector('.selected');
    // Находим элемент, над которым в данный момент находится курсор
    const currentElement = evt.target;
    // Проверяем, что событие сработало:
    // 1. не на том элементе, который мы перемещаем,
    // 2. именно на элементе списка
    const isMoveable = activeElement !== currentElement &&
      currentElement.classList.contains('product');

    // Если нет, прерываем выполнение функции
    if (!isMoveable) {
      return;
    }

    // Находим элемент, перед которым будем вставлять
    const nextElement = (currentElement === activeElement.nextElementSibling) ?
      currentElement.nextElementSibling :
      currentElement;

    // Вставляем activeElement перед nextElement
    tasksListElement.insertBefore(activeElement, nextElement);
  });

  const getNextElement = (cursorPosition, currentElement) => {
    // Получаем объект с размерами и координатами
    const currentElementCoord = currentElement.getBoundingClientRect();
    // Находим вертикальную координату центра текущего элемента
    const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

    // Если курсор выше центра элемента, возвращаем текущий элемент
    // В ином случае — следующий DOM-элемент
    const nextElement = (cursorPosition < currentElementCenter) ?
      currentElement :
      currentElement.nextElementSibling;

    return nextElement;
  };

  tasksListElement.addEventListener(`dragover`, (evt) => {
    evt.preventDefault();

    const activeElement = tasksListElement.querySelector(`.selected`);
    const currentElement = evt.target;
    const isMoveable = activeElement !== currentElement &&
      currentElement.classList.contains(`tasks__item`);

    if (!isMoveable) {
      return;
    }

    // evt.clientY — вертикальная координата курсора в момент,
    // когда сработало событие
    const nextElement = getNextElement(evt.clientY, currentElement);

    // Проверяем, нужно ли менять элементы местами
    if (
      nextElement &&
      activeElement === nextElement.previousElementSibling ||
      activeElement === nextElement
    ) {
      // Если нет, выходим из функции, чтобы избежать лишних изменений в DOM
      return;
    }

    tasksListElement.insertBefore(activeElement, nextElement);
  });
})
