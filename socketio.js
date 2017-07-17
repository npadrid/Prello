var instance;

module.exports = {
  getInstance: function(){
    return instance;
  },
  setup: function(server){
    instance = require('socket.io')(server);
    instance.on('connection', function(socket){
      // console.log('a user connected');
      // console.log(instance.engine.clientsCount);

      socket.on('disconnect', function(){
        // console.log('user disconnected');
        // console.log(instance.engine.clientsCount);
      });

      socket.on('room', function(data){
        socket.join(data.room);
      });

      socket.on('create list', function(data){
        socket.broadcast.to(data.data.bid).emit('new list', data);
      });

      socket.on('delete list', function(data){
        socket.broadcast.to(data.bid).emit('delete list', data);
      });

      socket.on('create card', function(data){
        socket.broadcast.to(data.bid).emit('new card', data);
      });

      socket.on('delete card', function(data){
        socket.broadcast.to(data.bid).emit('delete card', data);
      });
    });
  }
}
