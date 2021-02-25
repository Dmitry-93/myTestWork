"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// ----------- Создание сложных DOM струтур
function create(name, attributes) {
  var el = document.createElement(name);

  if (_typeof(attributes) == 'object') {
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

    if (typeof val == 'string') {
      val = document.createTextNode(val);
    }

    ;
    el.appendChild(val);
  }

  return el;
} // ----------- Создание сложных DOM струтур --------- Конец
// ----------- Создание формы редактирования имен


function EditNames() {
  if (document.getElementById('editName').contains(document.querySelector('.row'))) {
    document.getElementById('editName').style.display = 'flex';
  } else {
    var titles = document.querySelectorAll(".product__title");

    for (var i = 0; i < titles.length; i++) {
      var row = create("div", {
        Class: "row"
      }, create("input", {
        type: 'text',
        value: titles[i].innerHTML,
        name: "currentName_" + i,
        placeholder: titles[i].innerHTML,
        disabled: true
      }), create("input", {
        type: 'text',
        value: "",
        name: "newName_" + i,
        placeholder: "Новое наименование"
      }));
      document.getElementById('sendChangeName').before(row);
      document.getElementById('editName').style.display = 'flex';
    }
  }
}

function closeForm() {
  document.getElementById('editName').style.display = 'none';
} // ----------- Создание формы редактирования имен --------- Конец


function submit() {
  var request = new XMLHttpRequest();

  request.onload = function () {
    if (request.status == 200) {
      alert("Thank you!");
    }
  };

  request.open(this.method, this.action, true);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var inputs = document.querySelectorAll('input[type="text"]');
  var sendText = "";

  for (var i = 0; i < inputs.length / 2; i++) {
    if (this.querySelector("[name=\"newName_" + "".concat(i, "\"]")).value != "") {
      if (i == 0) {
        sendText += "currentName_" + "".concat(i, "=");
      } else {
        sendText += "&currentName_" + "".concat(i, "=");
      }

      sendText += encodeURIComponent(this.querySelector("[name=\"currentName_" + "".concat(i, "\"]")).value);
      sendText += "&newName_" + "".concat(i, "=");
      sendText += encodeURIComponent(this.querySelector("[name=\"newName_" + "".concat(i, "\"]")).value);
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
  var tasksListElement = document.querySelector('.tasks__list');
  var taskElements = tasksListElement.querySelectorAll('.product');

  var _iterator = _createForOfIteratorHelper(taskElements),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var task = _step.value;
      task.draggable = true;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  tasksListElement.addEventListener('dragstart', function (evt) {
    evt.target.classList.add('selected');
  });
  tasksListElement.addEventListener('dragend', function (evt) {
    evt.target.classList.remove('selected');
  });
  tasksListElement.addEventListener('dragover', function (evt) {
    // Разрешаем сбрасывать элементы в эту область
    evt.preventDefault(); // Находим перемещаемый элемент

    var activeElement = tasksListElement.querySelector('.selected'); // Находим элемент, над которым в данный момент находится курсор

    var currentElement = evt.target; // Проверяем, что событие сработало:
    // 1. не на том элементе, который мы перемещаем,
    // 2. именно на элементе списка

    var isMoveable = activeElement !== currentElement && currentElement.classList.contains('product'); // Если нет, прерываем выполнение функции

    if (!isMoveable) {
      return;
    } // Находим элемент, перед которым будем вставлять


    var nextElement = currentElement === activeElement.nextElementSibling ? currentElement.nextElementSibling : currentElement; // Вставляем activeElement перед nextElement

    tasksListElement.insertBefore(activeElement, nextElement);
  });

  var getNextElement = function getNextElement(cursorPosition, currentElement) {
    // Получаем объект с размерами и координатами
    var currentElementCoord = currentElement.getBoundingClientRect(); // Находим вертикальную координату центра текущего элемента

    var currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2; // Если курсор выше центра элемента, возвращаем текущий элемент
    // В ином случае — следующий DOM-элемент

    var nextElement = cursorPosition < currentElementCenter ? currentElement : currentElement.nextElementSibling;
    return nextElement;
  };

  tasksListElement.addEventListener("dragover", function (evt) {
    evt.preventDefault();
    var activeElement = tasksListElement.querySelector(".selected");
    var currentElement = evt.target;
    var isMoveable = activeElement !== currentElement && currentElement.classList.contains("tasks__item");

    if (!isMoveable) {
      return;
    } // evt.clientY — вертикальная координата курсора в момент,
    // когда сработало событие


    var nextElement = getNextElement(evt.clientY, currentElement); // Проверяем, нужно ли менять элементы местами

    if (nextElement && activeElement === nextElement.previousElementSibling || activeElement === nextElement) {
      // Если нет, выходим из функции, чтобы избежать лишних изменений в DOM
      return;
    }

    tasksListElement.insertBefore(activeElement, nextElement);
  });
});