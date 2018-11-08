/****************
    VARIABLES
***************/

/*List of countries available for this API:
English speaking countries: au,ca,gb,ie,nz,us
Persian speaking country: ir (different alphabet)
Others: br,ch,de,dk,es,fi,fr,nl,no,tr (latin based alphabets using accents)
We will limit the results to the English speaking countries in order for the Search Bar to work with an English keyboard (exceeds expectations requirements)
*/
const url = 'https://randomuser.me/api/?nat=au,ca,gb,ie,nz,us&results=12';


// the variable search is not empty as the modal toggle test for the search event if no search as occured
let search = ' ';

// when the url is set to all the countries, the country NO can return an error 500
// this counter is used with the checkStatus() function
let counterError = 0;

// these variables are used with the modal toggle
let idCardModal;
let idCardModalTest;


/*****************
FETCHING THE DATAS
*****************/

//fetching the data from the API and running tasks
function fetchData(url) {
  fetch(url)
    .then(checkStatus)
    .then(response => response.json())
    .then(data => createCards(data))
    .catch(error => console.log(error))
}

//checking the status and fetching the data again (10x) in case of error 500 (usually because of the country NO)
function checkStatus(response) {
  if(response.ok) {
   return Promise.resolve(response);
 } else if (response.status === 500 && counterError < 10) {
   //since the country NO return an error 500, we can try to fetch the data 10 times before giving up
   counterError += 1;
   fetchData(url);
 } else {
   return Promise.reject(new Error(response.statusText));
 }
}


/*****************
CREATING THE CARDS
*****************/

//function called to create the cards when the datas are fetched
function createCards(data) {

  //actually creating the cards
  $.each (data.results, function(i) {

    const newCard = $('<div>', {id : i, class : 'card'});
    $('#gallery').append(newCard);

    const photoContainer = $('<div>', {class : 'card-img-container'});
    const photo = $('<img>', {class : 'card-img', src: data.results[i].picture.large, alt :'profile picture'});
    photoContainer.append(photo);
    newCard.append(photoContainer);

    const infoContainer = $('<div>', {class : 'card-info-container'});
    newCard.append(infoContainer);

    const infoName = $('<h3>', {id: data.results[i].name.first + data.results[i].name.last, class : 'card-name cap', text : data.results[i].name.first + ' ' + data.results[i].name.last})
    infoContainer.append(infoName);

    const infoEmail = $('<p>', {class : 'card-text', text : data.results[i].email});
    infoContainer.append(infoEmail);

    const infoCity = $('<p>', {class : 'card-text cap', text : data.results[i].location.city});
    infoContainer.append(infoCity);

  });

  //when the cards are created, the modalEvents() and searchRunning() functions can be called
  modalEvents(data);
  searchRunning();
}


/************
MODAL WINDOW
************/

//function called when the user click on a card: displays a modal window
function modalEvents(data) {
  const cards = $('.card');

  cards.on('click', function() {
      //variables used for the modal toggle:
      //which card is displayed on the modal window
      idCardModal = parseInt($(this).attr('id'));
      //which card will be checked to be the newly card displayed on the modal window
      idCardModalTest = parseInt($(this).attr('id'));

      //creating the modal window
      creatingModal(data);
  });
}


//function creating the modal window
function creatingModal(data) {

  //actually creating the modal window with all the elements
  const newModalContainer = $('<div>', {class : 'modal-container'});
  $('#gallery').append(newModalContainer);

  const newModal = $('<div>', {class : 'modal'});
  newModalContainer.append(newModal);

  const newButton = $('<button>', {type : 'button', id : 'modal-close-btn', class : 'modal-close-btn', html : '<strong>X</strong>'});
  newModal.append(newButton);

  const newModalInfoContainer = $('<div>', {class : 'modal-info-container'})
  newModal.append(newModalInfoContainer);

  const photoModal = $('<img>', {class : 'modal-img', src: data.results[idCardModal].picture.large, alt :'profile picture'});
  newModalInfoContainer.append(photoModal);

  const nameModal = $('<h3>', {id : data.results[idCardModal].name.first + data.results[idCardModal].name.last, class : 'modal-name cap', text : data.results[idCardModal].name.first + ' ' + data.results[idCardModal].name.last});
  newModalInfoContainer.append(nameModal);

  const emailModal = $('<p>', {class : 'modal-text', text : data.results[idCardModal].email})
  newModalInfoContainer.append(emailModal);

  const cityModal = $('<p>', {class : 'modal-text cap', text : data.results[idCardModal].location.city})
  newModalInfoContainer.append(cityModal);

  newModalInfoContainer.append('<hr>');

  const phoneModal = $('<p>', {class : 'modal-text', text : data.results[idCardModal].phone})
  newModalInfoContainer.append(phoneModal);

  const addressModal = $('<p>', {class : 'modal-text', text : data.results[idCardModal].location.street + ', ' + data.results[idCardModal].location.city + ', ' + data.results[idCardModal].location.state + ' ' + data.results[idCardModal].location.postcode})
  newModalInfoContainer.append(addressModal);

  const birthdayModal = $('<p>', {class : 'modal-text', text : 'Birthday: ' + data.results[idCardModal].dob.date.charAt(8) + data.results[idCardModal].dob.date.charAt(9) + '/' + data.results[idCardModal].dob.date.charAt(5) + data.results[idCardModal].dob.date.charAt(6) + '/' + data.results[idCardModal].dob.date.charAt(2) + data.results[idCardModal].dob.date.charAt(3)})
  newModalInfoContainer.append(birthdayModal);

  const prevNextButtonsContainer = $('<div>', {class : 'modal-btn-container'});
  newModalContainer.append(prevNextButtonsContainer);

  const prevButton = $('<button>', {type : "button", id : "modal-prev", class : "modal-prev btn", text : 'Prev'})
  prevNextButtonsContainer.append(prevButton);

  const nextButton = $('<button>', {type : "button", id : "modal-next", class : "modal-next btn", text : 'Next'})
  prevNextButtonsContainer.append(nextButton);

  //when the modal window is created, the closeModalWindow(), prevModal() and nextModal() functions can be called
  closeModalWindow();
  prevModal(data);
  nextModal(data);
}


//function closing the modal window
function closeModalWindow() {
  $('#modal-close-btn').on('click', function() {
    $('.modal-container').remove();
  });
}


//when the 'prev' button is clicked
function prevModal(data) {
  $('#modal-prev').on('click', function() {
      checkingPrevCard(data)
  });
}

// checking to see if there is a previous card and, if there is one, if these card fits the search, displaying it or trying with another card
function checkingPrevCard(data) {

  // is there a card before this one?
  if (idCardModalTest > 0) {
    idCardModalTest -= 1;

    //storing the name of the card before
    const prevCardName = data.results[idCardModalTest].name.first + ' ' + data.results[idCardModalTest].name.last;

    // is this name matches the search? (the search value is ' ' by default, which fits every name)
    if(prevCardName.includes(search)) {
      // if it matches the search value, the current modal window is removed, the id of the card to display is stored and a new modal window is created using the newly stored id
      $('.modal-container').remove();
      idCardModal = idCardModalTest;
      creatingModal(data);
    } else {
      // if there is no match, the function is called again to check the card before the one just checked
      checkingPrevCard(data);
    }
  } else {
    // if there is no card to be checked left, the tests end and the id of the card currently displayed is stored for the next test to come
    idCardModalTest = idCardModal;
  }
}


//when the 'next' button is clicked
function nextModal(data) {
  $('#modal-next').on('click', function() {
      checkingNextCard(data);
  });
}

// checking to see if there is a next card and, if there is one, if these card fits the search, displaying it or trying with another card
function checkingNextCard(data) {

  // is there a card after this one?
  if (idCardModalTest < parseInt(data.results.length)-1) {
    idCardModalTest += 1;

    //storing the name of the next card
    const nextCardName = data.results[idCardModalTest].name.first + ' ' + data.results[idCardModalTest].name.last;

    // is this name matches the search? (the search value is ' ' by default, which fits every name)
    if(nextCardName.includes(search)) {
      // if it matches the search value, the current modal window is removed, the id of the card to display is stored and a new modal window is created using the newly stored id
      $('.modal-container').remove();
      idCardModal = idCardModalTest;
      creatingModal(data);
    } else {
      // if there is no match, the function is called again to check the card after the one just checked
      checkingNextCard(data);
    }
  } else {
    // if there is no card to be checked left, the tests end and the id of the card currently displayed is stored for the next test to come
    idCardModalTest = idCardModal;
  }
}


/*********
Search Bar
*********/

//function creating and displaying the Search Bar
function createSearchBar() {
  const searchBar = $('<form>', {action : '#', method : 'get'});
  $('.search-container').append(searchBar);

  const input1 = $('<input>', {type : "search", id : "search-input", class : "search-input", placeholder : "Search..."});
  searchBar.append(input1);

  const input2 = $('<input>', {type : "submit", value : "OK" , id : "search-submit", class : "search-submit"});
  searchBar.append(input2);
}


//function to hide all the cards not matching the searched value
function searchRunning() {

  //storing all the cards displayed
  const cards = $('.card');

  //when the search bar input is on focus: reset the last search
  $('#search-input').on('focus', function() {
    $.each(cards, function(i) {
      $(this).show();
    });
    search = ' ';
  });


  //when the search bar form is submitted
  $('#search-submit').on('click', function() {

    //storing the searched value for the 'prev' and 'next' functions
    search = $('#search-input')[0].value.toLowerCase();

    //hide all the cards not containing the value of the search bar
    $.each(cards, function(i) {
      if(cards[i].children[1].children[0].innerHTML.includes(search)) {
        console.log('found it');
      } else {
        console.log('nope');
        $(this).hide();
      }
    });

  //removing the last searched value from the search bar and losing focus
  $('#search-input')[0].value = '';
  $('#search-input').blur();
  });
}



/******************
Launching everything
******************/

createSearchBar();

fetchData(url);
