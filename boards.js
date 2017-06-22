var boards_btn = document.querySelector('#board-btn');
var boardSideBar = document.querySelector('.boardSideBar');
var addBoard = document.querySelector('#addBoard');

boards_btn.addEventListener('click', function(e){
  console.log(boardSideBar.style.left);
  if(boardSideBar.style.left == '0px'){
    boardSideBar.style.left = '-100%';
  }
  else{
    boardSideBar.style.left = '0';
  }
});
