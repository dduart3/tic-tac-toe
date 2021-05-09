import './style.css';
import './reset.css';

//Form element, this is from where we receive the book info
const $form = document.querySelector('.form');

//Book container element, the books elements are appended here
const $bookContainer = document.querySelector('.books-container__content');

//Gets the parsed localStorage library key value 
const localStorageLibrary = JSON.parse(localStorage.getItem('library'));

//Saves the actual library array in the localStorage
const updateStorage = (array)=>{
  localStorage.setItem('library', JSON.stringify(array));
}

//Library array, if the key don't exist it will load as an empty array, if not then will load the library key value 
const myLibrary = (localStorageLibrary) ? Array.from(localStorageLibrary) : [];

//Receives a book object, then pass it through the JSON.stringify() and JSON.parse() methods before saving it into the localStorage, this was made like this to store multiple values in the same key
const addBookToLibrary = (book) =>{
  const stringBook = JSON.stringify(book)
  const parsedBook = JSON.parse(stringBook);
  
  myLibrary.push(parsedBook);
  updateStorage(myLibrary);
}

//Book object constructor function
function Book(id, title,author, pages, read) {
  this.id = id;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;  
}


//Creates a modal element which is added to the DOM
function BookOptionsModal(){

  //Creates the modal elements
  this.$bookOptionsModal = document.createElement('div');
  this.$bookOptionsModalTitle = document.createElement('p');
  this.$bookOptionsModalButtons = document.createElement('div');
  this.$bookOptionsModalButtonsReadStatus = document.createElement('button');
  this.$bookOptionsModalButtonsDelete = document.createElement('button');
  this.$bookOptionsModalButtonsCancel = document.createElement('button');
  
  //Add classes to those elements
  this.$bookOptionsModal.classList.add('book-options-modal');
  this.$bookOptionsModalTitle.classList.add('book-options-modal__title');
  this.$bookOptionsModalButtons.classList.add('book-options-modal__buttons');
  this.$bookOptionsModalButtonsReadStatus.classList.add('book-options-modal__buttons__read-status');
  this.$bookOptionsModalButtonsDelete.classList.add('book-options-modal__buttons__delete');
  this.$bookOptionsModalButtonsCancel.classList.add('book-options-modal__buttons__cancel');
  
  
  //Add the text to the elements
  this.$bookOptionsModalTitle.textContent ='What do you wanna do?';
  this.$bookOptionsModalButtonsReadStatus.textContent = 'Change Read Status';
  this.$bookOptionsModalButtonsDelete.textContent = 'Delete';
  this.$bookOptionsModalButtonsCancel.textContent = 'Cancel';
  
  
  //Appends the Change Read Status and Delete button to the modal options button div element
  this.$bookOptionsModalButtons.appendChild(this.$bookOptionsModalButtonsReadStatus);
  this.$bookOptionsModalButtons.appendChild(this.$bookOptionsModalButtonsDelete);
  
  //Appends the title, the previous div with both buttons and finally the cancel buton
  this.$bookOptionsModal.appendChild(this.$bookOptionsModalTitle);
  this.$bookOptionsModal.appendChild(this.$bookOptionsModalButtons);
  this.$bookOptionsModal.appendChild(this.$bookOptionsModalButtonsCancel);
  
  //Appends the modal to the body
  document.body.appendChild(this.$bookOptionsModal);
}

//This function creates the book element structure which is appended to the book container div element
function createHtmlBook(book){

  const isReadValueTrue = () =>{
    return (book.read === true) ? true : false;
  }
  //Set the read book element content depending on the value (true is read, false is not read)
  const setReadContentValue = () => {
    (isReadValueTrue()) ? $bookCoverRead.textContent = "Read" : $bookCoverRead.textContent ="Not read";    
  }
  
  //Set the read book element class depending on the value (true will add the read class, false will add the not read class)
  const setReadClass = () => {
    (isReadValueTrue()) ? $bookCoverRead.classList.add('read') :  $bookCoverRead.classList.add('not-read')
  }

  //Create the book elements
  const $book = document.createElement('div');
  const $bookCover = document.createElement('div');
  const $bookCoverTitle = document.createElement('p');
  const $bookCoverAuthor = document.createElement('p');
  const $bookCoverPages = document.createElement('p');
  const $bookCoverRead = document.createElement('p');

  //Add an id to the book
  $book.setAttribute('id', book.id);

  //Add classes to the book elements
  $book.classList.add('book');
  $bookCover.classList.add('book__cover');
  $bookCoverTitle.classList.add('book__cover__title');
  $bookCoverAuthor.classList.add('book__cover__author');
  $bookCoverPages.classList.add('book__cover__pages');
  
  $bookCoverRead.classList.add('book__cover__read');

  //Call the functions that sets an specific class and content to the read element depending on the read value
  setReadClass();
  setReadContentValue();

  //Add the content to the book elements
  $bookCoverTitle.textContent = book.title;
  $bookCoverAuthor.textContent = book.author;
  $bookCoverPages.textContent =  `${book.pages} pages`;

  //Appends the book cover title, author, pages and read to the book cover element
  $bookCover.appendChild($bookCoverTitle);
  $bookCover.appendChild($bookCoverAuthor);
  $bookCover.appendChild($bookCoverPages);
  $bookCover.appendChild($bookCoverRead);

  //Appends the book cover element to the book element
  $book.appendChild($bookCover);

  //Appends the book element to the book container element which stores all the books
  $bookContainer.appendChild($book);


  //Add an event listener to the book element, this event listener haves 2 more event listeners which controls the modal buttons behaviour
  $book.addEventListener('click', (e)=>{
    e.preventDefault();

    //Get the book id attribute
    const bookId = $book.getAttribute('id');

    //Get the book storage value from the library array
    const bookStorageValue = myLibrary[bookId];

    //Creates a new instance of the Book Options Modal object
    const bookOptionsModal = new BookOptionsModal();

    /*
    Toggles the book read value, replaces the read element class and replaces the read element content depending on the actual value
    (if the actual value is read/true then will set the library array value to false , the class to "not-read" and the content to "Not read" 
    and viceversa) 
    */  
    const toggleReadValue = (readValue) =>{
      if(readValue===true) {

        readValue = false;  
        $bookCoverRead.classList.replace('read', 'not-read');
        $bookCoverRead.textContent = 'Not Read';

      }else{
        
        readValue = true;
        $bookCoverRead.classList.replace('not-read', 'read');
        $bookCoverRead.textContent = 'Read';

      }
    }

    /*
    Add an event listener to the modal read status button, if clicked will call the toggleReadValue() and updateStorage() functions
    This will change the book read status and save the changes in the storage value, after that it removes the modal from the DOM
    */
    bookOptionsModal.$bookOptionsModalButtonsReadStatus.addEventListener('click', (e)=>{
      e.preventDefault();
      const readValue = bookStorageValue.read;

      toggleReadValue(readValue);

      updateStorage(myLibrary);

      bookOptionsModal.$bookOptionsModal.remove();
    })
    
    /*
    Add an event listener to the modal delete button, if clicked will delete the value from the library array using the splice() method
    Removes the book element from the DOM, save the changes in storage and removes the modal from the dom
    */
    bookOptionsModal.$bookOptionsModalButtonsDelete.addEventListener('click', (e)=>{
      e.preventDefault();

      myLibrary.splice(bookId, 1);

      $book.remove();

      updateStorage(myLibrary);

      bookOptionsModal.$bookOptionsModal.remove();
    });

    
    //Add an event listener to the modal cancel button, this just removes the element from the DOM
    bookOptionsModal.$bookOptionsModalButtonsCancel.addEventListener('click', (e)=>{
      
      e.preventDefault();

      bookOptionsModal.$bookOptionsModal.remove();
    });
  });
}

//Receives a submit event and creates a Book object instance with the values received
const createBookFromForm = (submitEvent)=>{

  const id = myLibrary.length;
  const title = submitEvent.target[0].value;
  const author = submitEvent.target[1].value;
  const pages = submitEvent.target[2].value;
  const read = submitEvent.target[3].checked;

  const book = new Book(id, title, author, pages, read);
  
  return book;
}

//Add an event listener to the $form submit event, this creates a book, add it to the library array, create an html book and reset the form fields
$form.addEventListener('submit', (e)=>{
  e.preventDefault();

  const book = createBookFromForm(e);
  
  addBookToLibrary(book);

  createHtmlBook(book);
  
  $form.reset();
});

//This function will render all the books in the library in the DOM
const displayBooksFromLibrary = (library) =>{
  library.map(book => createHtmlBook(book));
}

displayBooksFromLibrary(myLibrary);

