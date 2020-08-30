let newBookBtn = document.getElementById("new-book");
let submitBtn = document.getElementById("submit-btn");
let bookForm = document.querySelector(".book-form");
let bookList = document.getElementById("book-list");
let title = document.getElementById("title");
let author = document.getElementById("author");
let pages = document.getElementById("pages");
let isRead = document.getElementById("read");

let myLibrary = [];

function Book(title, author, pages, read, id) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.id = id;
  this.toggleRead = () => {
    this.read = !this.read;
  }
  this.info = function() {
    return `Title: ${this.title}<br>Author: ${this.author}<br>Pages: ${this.pages}<br>Has been read: ${this.isRead}`;
  }
}

function addBookToLibrary(e) {
  e.preventDefault();
  //if (!isValid()) return;
  
  book = new Book(title.value, author.value, pages.value, read.checked, myLibrary.length);
  myLibrary.push(book);
  bookForm.reset();
  render();
  saveToLocalStorage();
}

function isValid() {
  const form = document.querySelector('.book-form');
  if (form.title.validity.tooShort) {
    form.title.setCustomValidity("The title is too short!");
  }
  return form.checkValidity();
}

function removeBookFromLibrary(e) {
  if (e.target.id == "remove-btn") {
    let id = e.target.closest("article").dataset.id;
    delete myLibrary[id];
    render();
    saveToLocalStorage();
    return;
  }
}

function toggleReadStatus(e) {
  if (e.target.id == "read-btn") {
    let bookCard = e.target.closest("article");
    let id = bookCard.dataset.id;

    myLibrary[id].toggleRead();
    let statusNode = bookCard.querySelector(".read-status > i");
    statusNode.textContent = parseReadStatus(myLibrary[id]);

    saveToLocalStorage();
  }
}

function render() {
  bookList.innerHTML = "";

  myLibrary.forEach(function(book) {
    if (book) {
      let markup = `
        <article data-id="${book.id}">
          <div class="book-info">
            <h2>${book.title}</h2>
            <p>Author: <i>${book.author}</i></p>
            <p>Pages: <i>${book.pages}</i></p>
            <p class="read-status">Read: <i>${parseReadStatus(book)}</i></p>
          </div>
          <div class="book-settings">
            <button id="remove-btn">Remove</button>
            <button id="read-btn">Read</button>
          </div>
        </article>
      `;

      bookList.insertAdjacentHTML("afterbegin", markup);
    }

  });
}

function parseReadStatus(book) {
  return book.read ? "Yes" : "No";
}

function toggleForm() {
  bookForm.classList.toggle("visible");
}

function saveToLocalStorage() {
  localStorage.setItem('Book Library', JSON.stringify(myLibrary));
}

newBookBtn.addEventListener("click", toggleForm);
submitBtn.addEventListener("click", addBookToLibrary);
bookList.addEventListener("click", removeBookFromLibrary);
bookList.addEventListener("click", toggleReadStatus);

window.onload = () => {
  if (localStorage.getItem('Book Library') !== null) {
    let library = JSON.parse(localStorage.getItem('Book Library'));
    
    library.forEach((book) => {
      if (book) {
        myLibrary.push(new Book(book.title, book.author, book.pages, book.read, myLibrary.length));
      }
    });
    render();
  }
}