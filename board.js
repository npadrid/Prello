var modal = document.querySelector('.modal');
var listOfLists;
var modal;

var listItems = [
  {
    title: 'first',
    cards: [
      { id: 1, labels: ['label-red', 'label-yellow'], description: '1.0', users: ['user1']},
      { id: 2, labels: ['label-red', 'label-blue'], description: '1.1', users: ['user1', 'user2', 'user3']}
    ]
  },
  {
    title: 'second',
    cards: [
      { id: 1, labels: ['label-green', 'label-yellow'], description: '2.0', users: ['user1']},
      { id: 2, labels: ['label-blue'], description: '2.1', users: ['user1','user3']}
    ]
  }
];

var map = {}

$('.content').click(function(){
  $('.boardSideBar').hide();
})

$('.board-navbtn').click(function(){
  $('.boardSideBar').toggle('fast');
})

$('#showMenu').click(function(){
  $('.sideMenu').animate({'right':'0'}, 300);
})

$('.menuClose').click(function(){
  $('.sideMenu').animate({'right':'-100%'}, 300);
})

$(function() {
  listOfLists = $('.listOfLists');

  //add preload data

  for(var i = 0; i < listItems.length; i++){
    //make lists
    var currentList = listItems[i];
    var listIndex = i;
    var title = currentList.title;
    var listItem = $('<li/>').addClass('listItem');
    listOfLists.children()[i].before(listItem[0]);

    var cardTitle = $('<input>').attr({type: "text", id: "cardTitle", value: title});
    listItem.append(cardTitle);

    var deleteList_btn = $('<img class="deleteList">').attr('src', 'close_window.png')[0];
    listItem.append(deleteList_btn);

    var newCardList = $('<ul/>').addClass("cardList");
    listItem.append(newCardList);

    var addCard_btn = $('<p/>').addClass("addCard").html("Add a card...")[0];
    listItem.append(addCard_btn);

    //make cards
    for(var j = 0; j < currentList.cards.length; j++){
      var currentCard = currentList.cards[j];
      var cardIndex = j;
      var cardId = currentCard.id;
      map[title + '-' + cardId] = {listIndex, cardIndex};

      var card = $('<li/>').addClass('card').attr('id', cardId);

      var labels = $('<div/>').addClass('labels').append($('<ul/>').addClass('labelList'));
      for (var x = 0; x < currentCard.labels.length; x++){
        $(labels).children()[0].append($('<li/>').attr({id: currentCard.labels[x]})[0]);
      }

      var cardDescription = $('<div/>').attr('id', 'description').html(currentCard.description);

      var userList = $('<div/>').addClass('userList').append($('<ul/>').addClass('users'));
      for (var y = 0; y < currentCard.users.length; y++){
        $(userList).children()[0].append($('<li/>').addClass('user').html(currentCard.users[y])[0]);
      }

      newCardList.append(card);
      card.append(labels, cardDescription, userList);
    }
  }

  //Add a card
  $(listOfLists).on('click', '.addCard', function() {
    var cardList = $(this).parent().find('.cardList')[0];
    createCardForm(cardList);
    createAddBtn(cardList);
    $(this).toggle();
    $(cardList).css('margin-bottom','0px');
  });

  //Add card button
  $(listOfLists).on('click', '#add_btn', function(){
    var cardList = $(this).parent();
    var cardListIndex = $(cardList).parent().index();
    var cardMap = listItems[cardListIndex].cards;
    var cardMapLength = cardMap.length;

    var cardDescription = cardList.find('.createCard')[0].value;
    var card = $('<li/>').addClass('card').attr('id', cardMapLength+1);
    var labels = $('<div/>').addClass('labels');
    var description = $('<div/>').attr('id', 'description');
    description.html(cardDescription);
    var userList = $('<div/>').addClass('userList');

    //update listItems
    addCardMap(cardDescription, cardMap, cardListIndex, cardMapLength, listItems[cardListIndex].title);

    //update cardList
    cardList.append(card);
    card.append(labels, description, userList);
    cardList.children('.createCard').remove();
    cardList.children('#add_btn').remove();
    cardList.children('#cancelCard').remove();
    $(cardList).css('margin-bottom','25px');
    $(cardList).parent().find('.addCard').toggle();
  });

  //Cancel add card
  $(listOfLists).on('click', '#cancelCard', function(){
    var cardList = $(this).parent();
    cardList.children('.createCard').remove();
    cardList.children('#add_btn').remove();
    cardList.children('#cancelCard').remove();
    $(cardList).parent().find('.addCard').toggle();
    $(cardList).css('margin-bottom','25px');
  })

  //Delete list
  $(listOfLists).on('click', '.deleteList', function() {
    var numCards = listItems[$(this).parent().index()].cards.length;

    //update map
    for (var i = 1; i <= numCards; i++){
      delete map[listItems[$(this).parent().index()].title + '-' + i];
    }

    //update listItems
    listItems.splice($(this).parent().index(), 1);
    console.log(listItems);

    //update listOfLists
    $(this).parent().remove();
  });

  //get card info
  $(listOfLists).on('click', '.card', function(){
    $(listOfLists).parent().siblings('.modal').children().css('display','block');
    $(listOfLists).parent().css('z-index', '-1');
    displayCardInfo(this);
    console.log(this);
    deleteCard(this);
  })

});

function addCardMap(description, cardMap, listIndex, cardIndex, title){
  var cardItem = {};
  cardItem.id = cardIndex+1;
  cardItem.labels = [];
  cardItem.description = description;
  cardItem.users = [];
  cardMap.push(cardItem);

  //update map
  map[title + '-' + cardItem.id] = {listIndex, cardIndex};
}

function createCardForm(list) {
  //get cardName
  var cardInfo = document.createElement('textarea');
  cardInfo.className = "createCard";
  list.appendChild(cardInfo);
}

function createAddBtn(list){
  var addCard_btn = $('<span/>').attr('id', 'add_btn').html('Add')[0];
  var cancelCard_btn = $('<img id="cancelCard">').attr('src', 'close_window.png')[0];
  list.append(addCard_btn);
  list.append(cancelCard_btn);
}

//Add list
$('#save-btn').click(function(){
  var listOfLists = $(this).parent().parent();
  //make individual list
  var listItem = $('<li/>').addClass('listItem');
  var lastIndex = $(this).parent().index();
  listOfLists.children()[lastIndex-1].after(listItem[0]);

  var newTitle = $(this).siblings('#listTitle').val()
  var cardTitle = $('<input>').attr({type: "text", id: "cardTitle", value: newTitle});
  listItem.append(cardTitle);

  var deleteList_btn = $('<img class="deleteList">').attr('src', 'close_window.png')[0];
  listItem.append(deleteList_btn);

  var cardList = $('<ul/>').addClass("cardList");
  listItem.append(cardList);

  var addCard_btn = $('<p/>').addClass("addCard").html("Add a card...")[0];
  listItem.append(addCard_btn);

  //update listItems
  var newListItem = {};
  newListItem.title = $(this).siblings('#listTitle').val();
  newListItem.cards = [];
  listItems.push(newListItem);

  $(this).css('display','none');
  $(this).siblings('#cancelList').css('display','none');
  $(this).siblings('#listTitle').val('Add a list...');
  $(this).siblings('#listTitle').css('background', 'none');
  $(this).siblings('#listTitle').css('color', 'white');
  $(this).parent().css('filter', 'brightness(80%)');
})

$('#listTitle').click(function(){
  $(this).val('');
  $(this).css('background', 'white');
  $(this).css('color', 'black');
  $(this).parent().css('filter', 'brightness(95%)');
  $(this).siblings('#save-btn').css('display','block');
  $(this).siblings('#cancelList').css('display','inline-block');
})

$('#cancelList').click(function(){
  $(this).css('display','none');
  $(this).siblings('#save-btn').css('display','none');
  $(this).siblings('#listTitle').val('Add a list...');
  $(this).siblings('#listTitle').css('background', 'none');
  $(this).siblings('#listTitle').css('color', 'white');
  $(this).parent().css('filter', 'brightness(80%)');
})

function displayCardInfo(card){
  modal = $('.modal-main');
  var list = $(card).parent().parent();
  var listIndex = list.index();
  var cardIndex = $(card).index();
  var modal_detail = $(modal).children('.cardDetails');
  modal.siblings('.modal-header').children('#modal-title').attr({value: listItems[listIndex].cards[cardIndex].description});
  var numUsers = listItems[listIndex].cards[cardIndex].users;
  var numLabels = listItems[listIndex].cards[cardIndex].labels;

  if(numUsers.length !== 0){
    var cardMembers = $('<div/>').attr('id', 'cardMembers');
    modal_detail.append(cardMembers[0]);
    var memberLabel = $('<h3/>').html('Members');
    cardMembers.append(memberLabel);
    var modalUsers = $('<ul/>').attr('id', 'modalUsers');
    for(var i = 0; i < numUsers.length; i++){
      modalUsers.append($('<li/>').attr('id', 'user').html(numUsers[i]));
    }
    cardMembers.append(modalUsers);
  }

  if(numLabels.length !== 0){
    var cardLabels = $('<div/>').attr('id', 'cardLabels');
    modal_detail.append(cardLabels[0]);
    var memberLabel = $('<h3/>').html('Labels');
    cardLabels.append(memberLabel);
    var modalLabels = $('<ul/>').attr('id', 'modalLabels');
    for(var j = 0; j < numLabels.length; j++){
      modalLabels.append($('<li/>').attr('id', numLabels[j]));
    }
    cardLabels.append(modalLabels);
  }
  $(modal).children('.cardDetails').append($('<input>').attr({type: "text", id: "editDescription", value: 'Edit the description...'}));
}

$('.modal-background').click(function(){
  $(this).parent().children().css('display','none');
  $(listOfLists).parent().css('z-index', '5');
  $(this).siblings('.modal-content').children('.modal-main').children('.cardDetails').children().remove();
})

$('#modal-close').click(function(){
  $(this).parent().parent().children().css('display','none');
  $(listOfLists).parent().css('z-index', '5');
  $(this).siblings('.modal-main').children('.cardDetails').children().remove();
})

function deleteCard(card){
  $('#deleteCard').click(function(){
    console.log(card);
    console.log($(card).parent().parent());
    listIndex = $(card).parent().parent().index();
    console.log(map);
    //update map
    delete map[listItems[listIndex].title + '-' + $(card).attr('id')];

    //update listItems
    cardIndex = listItems[listIndex].cards[$(card).attr('id')-1].id - 1;
    listItems[listIndex].cards.splice(cardIndex, 1);

    //update cardList
    $(card).parent().children('#' + $(card).attr('id')).remove();

    $(modal).parent().parent().children().css('display','none');
    $(listOfLists).parent().css('z-index', '5');
    $(modal).children('.cardDetails').children().remove();
  })
}
