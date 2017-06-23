var board_navbtn = document.querySelector('.board-navbtn');
var boardSideBar = document.querySelector('.boardSideBar');
var menu_btn = document.querySelector('#showMenu');
var sideMenu = document.querySelector('.sideMenu');
var sideMenuTitle = document.querySelector('#menuTitle');
var content = document.querySelector('.content');
var closeMenu = document.querySelector('.menuClose');
var addCard = document.querySelector('.addCard');
var addList = document.querySelector('#addList');
var deleteList = document.querySelector('.deleteList');
var listTitle = document.querySelector('#listTitle')
var modal = document.querySelector('.modal');
var card = document.querySelector('.card')


board_navbtn.addEventListener('click', function(){
  console.log(boardSideBar.style.left);
  if(boardSideBar.style.left == '0px'){
    boardSideBar.style.left = '-100%';
  }
  else{
    boardSideBar.style.left = '0';
  }
})

menu_btn.addEventListener('click', function(){
  console.log(sideMenu.style.right);
  sideMenu.style.right = '0';
})

closeMenu.addEventListener('click', function(){
  sideMenu.style.right = '-100%';
})

content.addEventListener('click', function(){
  boardSideBar.style.left = '-100%';
})

addCard.addEventListener('click', function(){
  var cardList = document.querySelector('.cardList');
  //get cardName
  var newcardTitle = document.createElement('textarea');
  newcardTitle.className = "card";
  newcardTitle.style.padding = "8px 0 8px 8px";
  newcardTitle.style.width = "220px";
  newcardTitle.style.left = "0";
  newcardTitle.style.border = "0";
  newcardList.appendChild(cardTitle);
  var add_btn = document.createElement('span');
  add_btn.className = "add_btn";
  add_btn.innerHTML = "Finish";
  cardList.appendChild(add_btn);

  add_btn.addEventListener('click', function(){
    //make individual card and insert into list
    var title = newcardTitle.value;
    var card = document.createElement('li');
    card.className = "card";
    cardList.appendChild(card);

    //add card info
    var cardInfo = document.createElement('div');
    cardInfo.className = "cardInfo";
    card.appendChild(cardInfo);

    //cardName
    var cardName = document.createElement('div');
    cardName.innerHTML = title;
    cardInfo.appendChild(cardName);

    this.parentNode.removeChild(this);
    newcardTitle.parentNode.removeChild(newcardTitle);
  })
})

listTitle.addEventListener('click', function(){
  var listOfLists = document.querySelector('.listOfLists');
  var save_btn = document.querySelector('#save-btn');
  var cancel_btn = document.querySelector('#cancelList');
  save_btn.style.display = 'block';
  cancel_btn.style.display = 'inline-block';

  save_btn.addEventListener('click', function(){
    //make individual list
    var newlistItem = document.createElement('li');
    newlistItem.className = "listItem";
    listOfLists.insertBefore(newlistItem, addList);

    var title = listTitle.value;
    var cardTitle = document.createElement("input");
    cardTitle.type = "text";
    cardTitle.id = "cardTitle";
    cardTitle.placeholder = title;
    newlistItem.appendChild(cardTitle);

    var delete_btn = document.createElement("img");
    delete_btn.src = "close_window.png";
    delete_btn.className = "deleteList";
    newlistItem.appendChild(delete_btn);

    var addCard_btn = document.createElement("p");
    addCard_btn.innerHTML = "Add a card...";
    addCard_btn.className = "addCard";
    newlistItem.appendChild(addCard_btn);

    save_btn.style.display = 'none';
    cancel_btn.style.display = 'none';

  })

  cancel_btn.addEventListener('click', function(){
    save_btn.style.display = 'none';
    cancel_btn.style.display = 'none';
  })
})

deleteList.addEventListener('click', function(){
  var listOfLists = document.querySelector('.listOfLists');
  var listItem = document.querySelector('.listItem');
  listItem.parentNode.removeChild(listItem);
  this.parentNode.removeChild(this);
})

card.onclick = function() {
    modal.style.display = "block";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
