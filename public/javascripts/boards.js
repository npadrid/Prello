var listOfBoards;
$('.board-navbtn').click(function(){
  $('.boardSideBar').toggle('fast');
})

var getJson = $.ajax({
    url: "http://localhost:3000/user/boards",
    type: "GET",
    dataType : "json",
})
.done(function (getJson) {
  // for(var i = 0; i < getJson.length; i++){
  //   //make map
  //   map[getJson[i]._id] = {title: getJson[i].title, cards: getJson[i].cards};
  // }
  console.log(getJson);
  //preload data
  listOfBoards = $('.listOfBoards');
  //loadData();
})
//
// function loadData(){
//   var addListIndex = 0;
//   for(list in map){
//     //make lists
//     var listItem = $('<li/>').addClass('listItem');
//     listOfLists.children()[addListIndex].before(listItem[0]);
//     var newCardList = createList(list, map[list].title, listItem);
//     addListIndex++;
//
//     //make cards
//     var cards = map[list].cards;
//     for(cardIndex in cards){
//       var card = cards[cardIndex];
//       var newCard = createCard(card._id, card.description, newCardList);
//       if(card.labels.length > 0){
//         addLabelList(newCard, card.labels);
//       }
//       if(card.users.length > 0){
//         addMemberList(newCard, card.users);
//       }
//     }
//   }
// }
//
// function createBoard(id, title, listItem){
//   listItem.attr('id', id);
//   var cardTitle = $('<input>').attr({type: "text", id: "cardTitle", value: title});
//   var deleteList_btn = $('<img class="deleteList">').attr('src', 'images/close_window.png')[0];
//   var newCardList = $('<ul/>').addClass("cardList");
//   var addCard_btn = $('<p/>').addClass("addCard").html("Add a card...")[0];
//
//   listItem.append(cardTitle, deleteList_btn, newCardList, addCard_btn);
//   return newCardList;
// }
// $('#addBoard').click(function(){
//   $(this).parent().append($('<li/>'))
// })

// function createBoardForm(list) {
//   var boardInfo = document.createElement('textarea');
//   boardInfo.className = "createBoard";
//   var addCard_btn = $('<span/>').attr('id', 'add_btn').html('Add')[0];
//   var cancelCard_btn = $('<img id="cancelCard">').attr('src', 'images/close_window.png')[0];
//   list.append(cardInfo, addCard_btn, cancelCard_btn);
// }
