var clientId = 'bj25s130tkb171z59dtgxbk2jdrie3'; 
var redirectURI = 'http://localhost:3000';
var scope = 'channel:read:redemptions';
var ws;

var data = "";
var config;

function authUrl() {
    sessionStorage.twitchOAuthState = nonce(15);
    var url = 'https://api.twitch.tv/kraken/oauth2/authorize' +
        '?response_type=token' +
        '&client_id=' + clientId + 
        '&redirect_uri=' + redirectURI +
        '&state=' + sessionStorage.twitchOAuthState +
        '&scope=' + scope;  
    return url;
}

function loadApp(){
    console.log(config.scope);
}

$(function() {
  $.getJSON("/data/jsonConfig", data, function(data, textStatus, jqXHR) {
    config = data;
    loadApp();
  });
});


