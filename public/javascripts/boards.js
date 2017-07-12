var listOfBoards;
var navbar;

$('.board-navbtn').click(function(){
  $('.boardSideBar').toggle('fast');
})

$('#userBtn').click(function(){
  $(this).parent().append($('<div/>').addClass('settings').append(
    $('<img/>').attr({id: 'closeSettings', src: 'images/close_window.png'}),
    $('<a/>').attr({id: 'logout', href: '/logout'}).html('Logout')
  ));
})

$(function() {
  listOfBoards = $('.listOfBoards');
  navbar = $('.navBar');

  $(navbar).on('click', '#closeSettings', function(){
    $(navbar).children('.settings').remove();
  });

  $(listOfBoards).on('click', '#addBoard', function(){
    //add header
    var boardInfo = document.createElement('textarea');
    boardInfo.className = "boardInfo";
    var createBtn = $('<span/>').attr('id', 'create_btn').html('Create');
    var cancelBoard = $('<img id="cancelBoard">').attr('src', 'images/close_window.png');
    $(this).parent().append($('<div/>').addClass('boardForm').append(boardInfo, createBtn, cancelBoard));
    $(this).remove();
  });

  $(listOfBoards).on('click', '#cancelBoard', function(){
    $(this).parent().parent().children('.boardForm').remove();
    $(listOfBoards).append($('<div/>').attr('id', 'addBoard').html('Create new board...'));
  });

  $(listOfBoards).on('click', '#create_btn', function(){
    var postJson = $.post("http://localhost:3000/boards",
      {'title': $(this).siblings('.boardInfo').val()}
    );
    postJson.done(function(data){
      var boardItem = $('<a/>').addClass('board').attr('href', "/boards/"+data._id).html(data.title);
      var lastIndex = $(listOfBoards).children('#welcomeBoard').index();
      $(listOfBoards).children()[lastIndex-1].after(boardItem[0]);
      $(listOfBoards).children('.boardForm').remove();
      $(listOfBoards).append($('<div/>').attr('id', 'addBoard').html('Create new board...'));
    })
  })
})
