var navbar;
var listOfLists;
var modal;
var main_modal;
var mainCard;
var map = {};
var bid = window.location.pathname.split('/')[2];
var socket = io();
socket.emit('room', {room: bid, user: $('#userBtn').html()});

socket.on('new list', function(data){
  var listItem = $('<li/>').addClass('listItem');
  listOfLists.children()[data.lastIndex].before(listItem[0]);
  createList(data.data._id, data.data.title, listItem);
  map[data.data._id] = {title: data.data.title, cards: []};
})
socket.on('delete list', function(data){
  $('#'+data.lid).remove();
  delete map[data.lid];
})

socket.on('new card', function(data){
  createCard(data.card._id, data.card.title, $('#'+data.lid).children('.cardList'));
  map[data.lid].cards.push(data.card);
});
socket.on('delete card', function(data){
  $('#'+data.cid).remove();
  map[data.lid].cards.splice(data.index, 1);
})

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
  $('.settings').remove();
  $(this).parent().append($('<div/>').addClass('settings').append(
    $('<img/>').attr({id: 'closeSettings', src: '../images/close_window.png'}),
    $('<a/>').attr({id: 'logout', href: '/logout'}).html('Logout')
  ));
})

$(function(){
  navbar = $('.navBar');
  $(navbar).on('click', '#closeSettings', function() {
    $('.settings').remove();
  });
});
$('#options-addMember-btn').click(function(){
  var user = $(this).siblings('#options-newMember').val();
  var postJson = $.post("http://localhost:3000/boards/" + bid + "/member",
    {"user": user}
  );
  postJson.done(function(data){
    if(data == "no user"){
      alert(`No such user`);
    }
    else if(data == "dup user"){
      alert(user + ' already added')
    }
    else {
      alert('Added ' + user);
    }
  })
});

//get data from api
var getJson = $.ajax({
    url: "http://localhost:3000/boards/" + bid + "/list",
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
      var newCard = createCard(card._id, card.title, newCardList);
      if(card.hasOwnProperty('labels') && card.labels.length > 0){ //card.labels.length > 0
        addLabelList(newCard, card.labels);
      }
      if(card.hasOwnProperty('users') && card.users.length > 0){ //card.users.length > 0
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
function createCard(id, title, cardList){
  var card = $('<li/>').addClass('card').attr('id', id);
  var cardTitle = $('<div/>').attr('id', 'title').html(title);
  cardList.append(card);
  card.append(cardTitle);
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
    var cardTitle = $(this).siblings('.createCard')[0].value;

    //update map and api
    var postJson = $.post("http://localhost:3000/boards/" + bid + "/list/" + listItemId +  "/card",
      {"title": cardTitle}
    );
    postJson.done(function(data){
      createCard(data.card._id, cardTitle, cardList);
      map[listItemId].cards.push(data.card);
      socket.emit('create card', data);
    });

    cardList.children('.createCard').remove();
    cardList.children('#add_btn').remove();
    cardList.children('#cancelCard').remove();
    $(cardList).css('margin-bottom','25px');
    $(cardList).parent().find('.addCard').toggle();
  });
  //Cancel add card
  $(listOfLists).on('click', '#cancelCard', function(){
    var cardList = $(this).parent();
    $('.createCard').remove();
    $('#add_btn').remove();
    $('#cancelCard').remove();
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
      url: "http://localhost:3000/boards/" + bid + "/list/" + listId,
      type: "DELETE"
    })

    socket.emit('delete list', {bid: bid, lid: listId});

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
  listOfLists.children()[lastIndex].before(listItem[0]);

  //update map and api
  var postJson = $.post("http://localhost:3000/boards/" + bid + "/list", {'title': listTitle});
  postJson.done(function(data){
    createList(data._id, listTitle, listItem);
    map[data._id] = {title: listTitle, cards: []};
    socket.emit('create list', {lastIndex: lastIndex, data:data});
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
      modal.siblings('.modal-header').children('#modal-title').attr({value: card.title});
      if(card.hasOwnProperty('users') && card.users.length > 0){
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

      if(card.hasOwnProperty('labels') && card.labels.length > 0){
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
      if(card.hasOwnProperty('comments') && card.comments.length > 0){
        for(var x = 0; x < card.comments.length; x++){
          var comment = card.comments[x];
          $('.modal-activity').append(
            $('<div/>').addClass('cardActivity').append(
              $('<p/>').addClass('commentUser').html(comment.author + ": "),
              $('<p/>').addClass('commentContent').html(comment.content),
              $('<p/>').addClass('commentDate').html(comment.postDate + " at " + comment.postTime)
            )
          )
        }
      }
    }
  }
  $(modal).children('.cardDetails').append($('<input>').attr({type: "text", id: "editDescription", value: 'Edit the description...'}));
}

$('.modal-background').click(function(){
  $(this).parent().children().css('display','none');
  $(listOfLists).parent().css('z-index', '5');
  var main = $(this).siblings('.modal-content').children('.modal-main');
  var sidebar = $(this).siblings('.modal-content').children('.modal-sidebar');
  $(main).children('.cardDetails').children().remove();
  $('.cardActivity').remove();
  $(main).children('.commentBox').children('#comment').val('');
  $(this).siblings('.modal-content').find('.addOptions').children().css('display', 'block');
  $('#availableMembers').remove();
  $('#availableLabels').remove();
})
$('#modal-close').click(function(){
  $(this).parent().parent().children().css('display','none');
  $(listOfLists).parent().css('z-index', '5');
  var main = $(this).siblings('.modal-main');
  var options = $(this).siblings('.modal-sidebar').children('.addOptions');
  $(main).children('.cardDetails').children().remove();
  $('.cardActivity').remove();
  $(main).children('.commentBox').children('#comment').val('');
  $(options).children().css('display', 'block');
  $('#availableMembers').remove();
  $('#availableLabels').remove();
})

//modal functions
$(function(){
  main_modal = $('.modal-content');
  //update members
  $(main_modal).on('click', '#addMember', function(){
    $(this).siblings().css('display', 'none');
    $('#availableMembers').remove();
    $(this).parent().append($('<div/>').attr('id', 'availableMembers').append($('<h3/>').html('Add members')));
    var getJson = $.ajax({
        url: "http://localhost:3000/boards/" + bid + "/list/user",
        type: "GET",
        dataType : "json",
    })
    getJson.done(function(data){
      for(var i = 0; i < data.length; i++){
        if(data[i] != $('#userBtn').html()){
          $('#availableMembers').append($('<div/>').attr('id', 'currentMembers').html(data[i]));
        }
      }
    });
  });
  $(main_modal).on('click', '#currentMembers', function(){
    var listObj = map[$(mainCard).parent().parent().attr('id')];
    var cardId = $(mainCard).attr('id');
    var card;
    var newMember = $(this).html();

    //update map
    for(cardIndex in listObj.cards){
      var currentCard = listObj.cards[cardIndex];
      if (currentCard._id === cardId){
        if(currentCard.hasOwnProperty('users')){
          currentCard.users.push(newMember);
        }
        else{
          currentCard.users = [newMember];
        }
        card = currentCard;
        break;
      }
    }
    // //update api
    var patchJson = $.ajax({
        url: "http://localhost:3000/boards/" + bid + "/list/" + $(mainCard).parent().parent().attr('id') + "/card/" + cardId,
        type: "PATCH",
        data: {card},
        dataType : "json",
    });

    if($(mainCard).find('.users').length == 0){
      $(mainCard).append($('<div/>').addClass('userList').append(
        $('<ul/>').addClass('users').append(
          $('<li/>').addClass('user').html(newMember)[0]
        )
      )
    )}
    else{
      $(mainCard).find('.users')[0].append($('<li/>').addClass('user').html(newMember)[0]);
    }

    $('.cardDetails').children().remove();
    $(this).parent().siblings().css('display', 'block');
    $(this).parent().remove();
    displayCardInfo(mainCard);
  })

  //update labels
  $(main_modal).on('click', '#addLabel', function(){
    $(this).siblings().css('display', 'none');
    $('#availableLabels').remove();
    $(this).parent().append($('<div/>').attr('id', 'availableLabels'));
    for(labelIndex in labelColors){
      $(this).siblings('#availableLabels').append($('<div/>').addClass('modal_label').attr('id', labelColors[labelIndex]));
    }
  });
  $(main_modal).on('click', '.modal_label', function(){
    var listObj = map[$(mainCard).parent().parent().attr('id')];
    var cardId = $(mainCard).attr('id');
    var card;
    //update map
    for(cardIndex in listObj.cards){
      var currentCard = listObj.cards[cardIndex];
      if (currentCard._id === cardId){
        if(currentCard.hasOwnProperty('labels')){
          currentCard.labels.push($(this).attr('id'));
        }
        else{
          currentCard.labels = [$(this).attr('id')];
        }
        card = currentCard;
        break;
      }
    }
    //update api
    var patchJson = $.ajax({
        url: "http://localhost:3000/boards/" + bid + "/list/" + $(mainCard).parent().parent().attr('id') + "/card/" + cardId,
        type: "PATCH",
        data: {card},
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
    $('.cardDetails').children().remove();
    $(this).parent().siblings().css('display', 'block');
    $(this).parent().remove();
    displayCardInfo(mainCard);
  })

  //add comment
  $(main_modal).on('click', '#addComment', function(){
    var listObj = map[$(mainCard).parent().parent().attr('id')];
    var cardId = $(mainCard).attr('id');
    var content = $(this).siblings('#comment').val();
    var currentTime = new Date();
    var date = (currentTime.getMonth()+1)+'-'+currentTime.getDate()+'-'+currentTime.getFullYear();
    var time = currentTime.getHours() + ":" + currentTime.getMinutes() + ":" + currentTime.getSeconds();

    var postJson = $.ajax({
        url: "http://localhost:3000/boards/" + bid + "/list/" + $(mainCard).parent().parent().attr('id') + "/card/" + $(mainCard).attr('id') + "/comment",
        type: "POST",
        data: {'content': content, 'date': date, 'time': time},
        dataType : "json",
    });
    postJson.done(function(data){
      //update card modal
      for(cardIndex in listObj.cards){
        var currentCard = listObj.cards[cardIndex];
        if (currentCard._id === cardId){
          if(currentCard.hasOwnProperty('comments')){
            currentCard.comments.push({author: data.author, content: data.content, postDate: date, postTime: time});
          }
          else{
            currentCard.comments = [{author: data.author, content: data.content, postDate: date, postTime: time}];
          }
          break;
        }
      }
      $('.modal-activity').append(
        $('<div/>').addClass('cardActivity').append(
          $('<p/>').addClass('commentUser').html(data.author + ": "),
          $('<p/>').addClass('commentContent').html(data.content),
          $('<p/>').addClass('commentDate').html(data.postDate + " at " + data.postTime)
        )
      )
    });
    $('.cardDetails').children().remove();
    $('.cardActivity').remove();
    $('#comment').val('');
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
            var deleteJson = $.ajax({
              url: "http://localhost:3000/boards/" + bid + "/list/" + listId + "/card/" + cards[cardIndex]._id,
              type: "DELETE"
            })
            deleteJson.done(function(data){
              socket.emit('delete card', {bid: data.bid, lid: data.lid, cid: $(mainCard).attr('id'), index: cardIndex});
            })
            cards.splice(cardIndex, 1);
          }
        }
      }
    }
    //update cardList
    $('#' + $(mainCard).attr('id')).remove();

    $(modal).parent().parent().children().css('display','none');
    $(listOfLists).parent().css('z-index', '5');
    $('.cardDetails').children().remove();
  });
})
