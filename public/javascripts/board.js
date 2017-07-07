var listOfLists;
var modal;
var main_modal;
var mainCard;
var map = {};
var labelColors = ["label-green", "label-yellow", "label-red", "label-blue"];

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

$('#userBtn').click(function(){
  $(this).parent().append($('<div/>').addClass('settings').append(
    $('<img/>').attr({id: 'closeSettings', src: '../images/close_window.png'}),
    $('<a/>').attr({id: 'logout', href: '/logout'}).html('Logout')
  ));
})

//get data from api
var getJson = $.ajax({
    url: "http://localhost:3000/list",
    type: "GET",
    dataType : "json",
})
.done(function (getJson) {
  for(var i = 0; i < getJson.length; i++){
    //make map
    map[getJson[i]._id] = {title: getJson[i].title, cards: getJson[i].cards};
  }
  //preload data
  listOfLists = $('.listOfLists');
  loadData();
})

function loadData(){
  var addListIndex = 0;
  for(list in map){
    //make lists
    var listItem = $('<li/>').addClass('listItem');
    listOfLists.children()[addListIndex].before(listItem[0]);
    var newCardList = createList(list, map[list].title, listItem);
    addListIndex++;

    //make cards
    var cards = map[list].cards;
    for(cardIndex in cards){
      var card = cards[cardIndex];
      var newCard = createCard(card._id, card.description, newCardList);
      if(card.labels.length > 0){
        addLabelList(newCard, card.labels);
      }
      if(card.users.length > 0){
        addMemberList(newCard, card.users);
      }
    }
  }
}

function createList(id, title, listItem){
  listItem.attr('id', id);
  var cardTitle = $('<input>').attr({type: "text", id: "cardTitle", value: title});
  var deleteList_btn = $('<img class="deleteList">').attr('src', '../images/close_window.png')[0];
  var newCardList = $('<ul/>').addClass("cardList");
  var addCard_btn = $('<p/>').addClass("addCard").html("Add a card...")[0];

  listItem.append(cardTitle, deleteList_btn, newCardList, addCard_btn);
  return newCardList;
}

function createCard(id, description, cardList){
  var card = $('<li/>').addClass('card').attr('id', id);
  var cardDescription = $('<div/>').attr('id', 'description').html(description);

  cardList.append(card);
  card.append(cardDescription);
  return card;
}

function addLabelList(card, labels){
  $(card).prepend($('<div/>').addClass('labels').append($('<ul/>').addClass('labelList')));
  for (var i = 0; i < labels.length; i++){
    $(card).find('.labelList')[0].append($('<li/>').attr({id: labels[i]})[0]);
  }
}

function addMemberList(card, users){
  $(card).append($('<div/>').addClass('userList').append($('<ul/>').addClass('users')));
  for (var j = 0; j < users.length; j++){
    $(card).find('.users')[0].append($('<li/>').addClass('user').html(users[j])[0]);
  }
}

//list functions
$(function() {
  listOfLists = $('.listOfLists');
  // //Add a card
  $(listOfLists).on('click', '.addCard', function() {
    var cardList = $(this).siblings('.cardList')[0];
    createCardForm(cardList);
    $(this).toggle();
    $(cardList).css('margin-bottom','0px');
  });

  //Save card button
  $(listOfLists).on('click', '#add_btn', function(){
    var cardList = $(this).parent();
    var listItemId = $(cardList).parent().attr('id');
    var cardDescription = $(this).siblings('.createCard')[0].value;

    //update map and api
    var postJson = $.post("http://localhost:3000/list/" + listItemId +  "/card",
      {'labels': [], "description": cardDescription, "users": []}
    );
    postJson.done(function(data){
      var cardId = data.cards[data.cards.length-1]._id;
      createCard(cardId, cardDescription, cardList);
      map[listItemId].cards.push({
        "description" : cardDescription,
        'labels': [],
        "users":[],
        "_id": cardId
      })
    })

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
    var listId = $(this).parent().attr('id');
    //update map
    delete map[listId];

    //update api
    var deleteJson = $.ajax({
      url: "http://localhost:3000/list/" + listId,
      type: "DELETE"
    })

    // //update listOfLists
    $(this).parent().remove();
  });

  //get card info
  $(listOfLists).on('click', '.card', function(){
    $(listOfLists).parent().siblings('.modal').children().css('display','block');
    $(listOfLists).parent().css('z-index', '-1');
    displayCardInfo(this);
    mainCard = this;
  })
});

function createCardForm(list) {
  var cardInfo = document.createElement('textarea');
  cardInfo.className = "createCard";
  var addCard_btn = $('<span/>').attr('id', 'add_btn').html('Add')[0];
  var cancelCard_btn = $('<img id="cancelCard">').attr('src', '../images/close_window.png')[0];
  list.append(cardInfo, addCard_btn, cancelCard_btn);
}

//Add list
$('#listTitle').click(function(){
  $(this).val('');
  $(this).css('background', 'white');
  $(this).css('color', 'black');
  $(this).parent().css('filter', 'brightness(95%)');
  $(this).siblings('#save-btn').css('display','block');
  $(this).siblings('#cancelList').css('display','inline-block');
})

$('#save-btn').click(function(){
  //make individual list
  var listItem = $('<li/>').addClass('listItem');
  var lastIndex = $(this).parent().index();
  var listTitle = $(this).siblings('#listTitle').val();
  listOfLists.children()[lastIndex-1].after(listItem[0]);

  //update map and api
  var postJson = $.post("http://localhost:3000/list", {'title': listTitle});
  postJson.done(function(data){
    createList(data._id, listTitle, listItem);
    map[data._id] = {title: listTitle, cards: []};
  })

  $(this).css('display','none');
  $(this).siblings('#cancelList').css('display','none');
  $(this).siblings('#listTitle').val('Add a list...');
  $(this).siblings('#listTitle').css('background', 'none');
  $(this).siblings('#listTitle').css('color', 'white');
  $(this).parent().css('filter', 'brightness(80%)');
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
  var listObj = map[$(card).parent().parent().attr('id')];
  $(modal).siblings('.modal-header').children('#modal-cardLocation').html("in list " + listObj.title);
  var cardId = $(card).attr('id');
  var modal_detail = $(modal).children('.cardDetails');

  for(cardIndex in listObj.cards){
    var card = listObj.cards[cardIndex];
    if (card._id === cardId){
      modal.siblings('.modal-header').children('#modal-title').attr({value: card.description});
      if(card.users.length > 0){
        var cardMembers = $('<div/>').attr('id', 'cardMembers');
        modal_detail.append(cardMembers[0]);
        var memberLabel = $('<h3/>').html('Members');
        cardMembers.append(memberLabel);
        var modalUsers = $('<ul/>').attr('id', 'modalUsers');
        for(var i = 0; i < card.users.length; i++){
          modalUsers.append($('<li/>').attr('id', 'user').html(card.users[i]));
        }
        cardMembers.append(modalUsers);
      }

      if(card.labels.length > 0){
        var cardLabels = $('<div/>').attr('id', 'cardLabels');
        modal_detail.append(cardLabels[0]);
        var memberLabel = $('<h3/>').html('Labels');
        cardLabels.append(memberLabel);
        var modalLabels = $('<ul/>').attr('id', 'modalLabels');
        for(var j = 0; j < card.labels.length; j++){
          modalLabels.append($('<li/>').attr('id', card.labels[j]));
        }
        cardLabels.append(modalLabels);
      }
    }
  }
    $(modal).children('.cardDetails').append($('<input>').attr({type: "text", id: "editDescription", value: 'Edit the description...'}));
}

$('.modal-background').click(function(){
  $(this).parent().children().css('display','none');
  $(listOfLists).parent().css('z-index', '5');
  $(this).siblings('.modal-content').children('.modal-main').children('.cardDetails').children().remove();
  $(this).siblings('.modal-content').find('.addOptions').children().css('display', 'block');
  $(this).siblings('.modal-content').children('.modal-sidebar').children('.addOptions').children('#availableMembers').remove();
  $(this).siblings('.modal-content').children('.modal-sidebar').children('.addOptions').children('#availableLabels').remove();
})

$('#modal-close').click(function(){
  $(this).parent().parent().children().css('display','none');
  $(listOfLists).parent().css('z-index', '5');
  $(this).siblings('.modal-main').children('.cardDetails').children().remove();
  $(this).siblings('.modal-sidebar').children('.addOptions').children().css('display', 'block');
  $(this).siblings('.modal-sidebar').children('.addOptions').children('#availableMembers').remove();
  $(this).siblings('.modal-sidebar').children('.addOptions').children('#availableLabels').remove();
})

//modal functions
$(function(){
  main_modal = $('.modal-content');
  //update members
  $(main_modal).on('click', '#addMember', function(){
    $(this).siblings().css('display', 'none');
    $(this).siblings('#availableMembers').remove();
    $(this).parent().append($('<div/>').attr('id', 'availableMembers').append($('<h3/>').html('Add members')).append($('<input>').attr({type: "text", id: "newMember"})));
    for(var i = 0; i < $(mainCard).find('.user').length; i++){
      var member = $(mainCard).find('.user')[i];
      $(this).siblings('#availableMembers').append($('<div/>').attr('id', 'currentMembers').html($($(mainCard).find('.user')[i]).text()));
    }
    $(this).siblings('#availableMembers').append($('<span/>').attr('id', 'newMemberBtn').html('Add'));
  });
  $(main_modal).on('click', '#newMemberBtn', function(){
    var listObj = map[$(mainCard).parent().parent().attr('id')];
    var cardId = $(mainCard).attr('id');
    var cardLabels;
    var cardDescription;
    var cardUsers;
    //update map
    for(cardIndex in listObj.cards){
      var currentCard = listObj.cards[cardIndex];
      if (currentCard._id === cardId){
        currentCard.users.push($(this).siblings('#newMember').val());
        break;
      }
    }
    cardLabels = currentCard.labels;
    cardDescription = currentCard.description;
    cardUsers = currentCard.users;
    // //update api
    var patchJson = $.ajax({
        url: "http://localhost:3000/list/" + $(mainCard).parent().parent().attr('id') + "/card/" + cardId,
        type: "PATCH",
        data: {"labels": cardLabels,
        "description": cardDescription,
        "users": cardUsers,
        "_id": cardId},
        dataType : "json",
    })

    //update card
    if($(mainCard).find('.users').length == 0){
      $(mainCard).append($('<div/>').addClass('userList').append(
        $('<ul/>').addClass('users').append(
          $('<li/>').addClass('user').html($(this).siblings('#newMember').val())[0]
        )
      )
    )}
    else{
      $(mainCard).find('.users')[0].append($('<li/>').addClass('user').html($(this).siblings('#newMember').val())[0]);
    }
    $(this).parent().parent().parent().siblings('.modal-main').children('.cardDetails').children().remove();
    $(this).parent().siblings().css('display', 'block');
    $(this).siblings('#newMember').val('');
    $(this).parent().remove();
    displayCardInfo(mainCard);
  })

  //update labels
  $(main_modal).on('click', '#addLabel', function(){
    $(this).siblings().css('display', 'none');
    $(this).siblings('#availableLabels').remove();
    $(this).parent().append($('<div/>').attr('id', 'availableLabels'));
    for(labelIndex in labelColors){
      $(this).siblings('#availableLabels').append($('<div/>').addClass('modal_label').attr('id', labelColors[labelIndex]));
    }
  });
  $(main_modal).on('click', '.modal_label', function(){
    var listObj = map[$(mainCard).parent().parent().attr('id')];
    var cardId = $(mainCard).attr('id');
    var cardLabels;
    var cardDescription;
    var cardUsers;
    //update map
    for(cardIndex in listObj.cards){
      var currentCard = listObj.cards[cardIndex];
      if (currentCard._id === cardId){
        currentCard.labels.push($(this).attr('id'));
        break;
      }
    }
    cardLabels = currentCard.labels;
    cardDescription = currentCard.description;
    cardUsers = currentCard.users;
    console.log(cardLabels);
    //update api
    var patchJson = $.ajax({
        url: "http://localhost:3000/list/" + $(mainCard).parent().parent().attr('id') + "/card/" + cardId,
        type: "PATCH",
        data: {"labels": cardLabels,
        "description": cardDescription,
        "users": cardUsers,
        "_id": cardId},
        dataType : "json",
    })

    //update card
    if($(mainCard).find('.labelList').length == 0){
      $(mainCard).prepend($('<div/>').addClass('labels').append(
        $('<ul/>').addClass('labelList').append(
          $('<li/>').attr('id', $(this).attr('id'))[0]
        )
      )
    )}
    else{
      $(mainCard).find('.labelList')[0].prepend($('<li/>').attr('id', $(this).attr('id'))[0]);
    }
    $(this).parent().parent().parent().siblings('.modal-main').children('.cardDetails').children().remove();
    $(this).parent().siblings().css('display', 'block');
    $(this).parent().remove();
    displayCardInfo(mainCard);
  })

  //delete card
  $(main_modal).on('click', '#deleteCard', function(){
    var listId = $(mainCard).parent().parent().attr('id');
    //update map and api
    for(list in map){
      if(list === listId){
        var cards = map[list].cards;
        for(cardIndex in cards){
          if(cards[cardIndex]._id === $(mainCard).attr('id')){
            var index = cardIndex;
            var deleteJson = $.ajax({
              url: "http://localhost:3000/list/" + listId + "/card/" + cards[cardIndex]._id,
              type: "DELETE"
            })
            deleteJson.done(function(){
              cards.splice(index, 1);
            })
          }
        }
      }
    }

    //update cardList
    $(mainCard).parent().children('#' + $(mainCard).attr('id')).remove();

    $(modal).parent().parent().children().css('display','none');
    $(listOfLists).parent().css('z-index', '5');
    $(modal).children('.cardDetails').children().remove();
  });
})
