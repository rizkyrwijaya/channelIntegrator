var clientId = 'bj25s130tkb171z59dtgxbk2jdrie3'; 
var redirectURI = 'http://localhost:3000';
var scope = 'channel:read:redemptions';
var ws;

var data = "";
var config;

function heartbeat() {
  message = {
      type: 'PING'
  };
  console.log('SENT: ' + JSON.stringify(message));
  ws.send(JSON.stringify(message));
}

function showAlert(message){
  var alertFromTwitch = JSON.parse(message);
  console.log(alertFromTwitch);
  config.listOfCustomRewards.forEach(element => {
    if(element.rewardName == alertFromTwitch.data.redemption.reward.title){
      console.log(element.alertData.imgPath)
      var swalData = {
        backdrop: false,
        showConfirmButton: false,
        timer: 1000,
        text: alertFromTwitch.data.redemption.user_input,
        onOpen: function() {
          var zippi = new Audio('http://localhost:3000/audio/ayaya.mp3')
          zippi.play();
        }
      }
      console.log(swalData);
      Swal.fire(swalData)
    }
  });
}

function listen(topic) {
  message = {
      type: 'LISTEN',
      nonce: nonce(15),
      data: {
          topics: [topic],
          auth_token: accessToken
      }
  };
  console.log('SENT: ' + JSON.stringify(message));
  ws.send(JSON.stringify(message));
}

function nonce(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function connect() {
  var heartbeatInterval = 1000 * 60; //ms between PING's
  var reconnectInterval = 1000 * 3; //ms to wait before reconnect
  var heartbeatHandle;

  ws = new WebSocket('wss://pubsub-edge.twitch.tv');

  ws.onopen = function(event) {
      console.log("Socket Opened");
      heartbeat();
      heartbeatHandle = setInterval(heartbeat, heartbeatInterval);
      listen(config.topic + userId);
  };

  ws.onerror = function(error) {
      console.log("Error: " + error);
  };

  ws.onmessage = function(event) {
      message = JSON.parse(event.data);
      console.log(message);
      if(message.type == "MESSAGE"){  
      showAlert(message.data.message);
      }
      if (message.type == 'RECONNECT') {
        console.log("Reconnecting");
          setTimeout(connect, reconnectInterval);
      }
  };

  ws.onclose = function() {
      console.log("Socket Closed");
      clearInterval(heartbeatHandle);
      console.log("Reconnecting");
      setTimeout(connect, reconnectInterval);
  };

}

function loadApp(){
    console.log(config);
    connect();
}

$(function() {
  $.getJSON("/data/jsonConfig", data, function(data, textStatus, jqXHR) {
    config = data;
    loadApp();
  });
});


