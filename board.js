var board_navbtn = document.querySelector('.board-navbtn');
var boardSideBar = document.querySelector('.boardSideBar');
var menu_btn = document.querySelector('#showMenu');
var sideMenu = document.querySelector('.sideMenu');
var sideMenuTitle = document.querySelector('#menuTitle');
var background = document.querySelector('.background');
var closeMenu = document.querySelector('.menuClose');
var addCard = document.querySelector('.addCard');

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

background.addEventListener('click', function(){
  boardSideBar.style.left = '-100%';
})

addCard.addEventListener('click', function(){
  var listItem = document.querySelector('.listItem');
  var card = document.createElement('ul');
  card.className = "cardList"; 
  listItem.appendChild(card);
})
