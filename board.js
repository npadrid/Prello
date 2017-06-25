var modal = document.querySelector('.modal');
var listOfLists;

// var listItems = [
//   {
//     title: 'first',
//     cards: [
//       { id: '1', description: '1.0' },
//       { id: '2', description: '1.1' },
//     ]
//   },
//   {
//     title: 'second',
//     cards: [
//       { id: '2.1', description: '2.0' },
//       { id: '2.2', description: '2.1' },
//     ]
//   }
// ];

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

  //Add a card
  $(listOfLists).on('click', '.addCard', function() {
    var cardList = $(this).parent().find('.cardList')[0];
    createCard(cardList);
    createAddBtn(cardList);
    $(this).toggle();
  });

  //Add card button
  $(listOfLists).on('click', '#add_btn', function(){
    var cardList = $(this).parent();
    var cardDescription = cardList.find('.createCard')[0].value;
    console.log(cardDescription);
    var card = $('<li/>').addClass('card');
    var labels = $('<div/>').addClass('labels');
    var description = $('<div/>').attr('id', 'description');
    description.html(cardDescription);
    var userList = $('<div/>').addClass('userList');

    cardList.append(card);
    card.append(labels, description, userList);
    cardList.children('.createCard').remove();
    cardList.children('#add_btn').remove();
    cardList.children('#cancelCard').remove();
    $(cardList).parent().find('.addCard').toggle();
  });

  //Cancel add card
  $(listOfLists).on('click', '#cancelCard', function(){
    var cardList = $(this).parent();
    cardList.children('.createCard').remove();
    cardList.children('#add_btn').remove();
    cardList.children('#cancelCard').remove();
    $(cardList).parent().find('.addCard').toggle();
  })

  //Delete list
  $(listOfLists).on('click', '.deleteList', function() {
    $(this).parent().remove();
  });
});

function createCard(list) {
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

  var cardTitle = $('<input>').attr({type: "text", id: "cardTitle", value: $(this).siblings('#listTitle').val()});
  listItem.append(cardTitle);

  var deleteList_btn = $('<img class="deleteList">').attr('src', 'close_window.png')[0];
  listItem.append(deleteList_btn);

  var cardList = $('<ul/>').addClass("cardList");
  listItem.append(cardList);

  var addCard_btn = $('<p/>').addClass("addCard").html("Add a card...")[0];
  listItem.append(addCard_btn);

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
