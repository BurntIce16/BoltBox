(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
//host screen manager
//This will handle the game selection screen, and the interfaces for the games themselves

let serverws = null;
let clientID;

connectWS();

function connectWS() {
	//lets ws work over localhost and ipv4 (an in theory dedicated dns but that will require more work)
	let url = new URL(window.location.href);
	url.port = "8080";
	url.protocol = "ws";
	serverws = new WebSocket(url, 13);

	//check if cookies have any data
	let cookie = document.cookie;
	cookie = cookie.split("id=")[1];
	cookie = cookie.split("; undefined")[0];
	console.log(cookie);
	clientID = cookie;
	

	serverws.onopen = () => {
		console.log("Connected to server");
        //TODO elevate this ws from a client to a host
	};

	serverws.onmessage = (message) => {
		//console.log(`Received message: ${message.data}`);
		handleData(message.data);
	};

	serverws.onclose = () => {
		handleData(JSON.parse(`{'type':'interface', 'data':'<h1>Server Has Closed</h1>'}`));
	}
}

function handleData(data) {
	data = JSON.parse(data);
	//handle data from server
	if (data.type == "interface") {
		//replace all html within the interface div with the html under data.data
		interfaceDiv.innerHTML = data.data;
	}
}

function messageFormater(type, data){
	return JSON.stringify({
		type:type,
		data:data
	});
}


//Click input manager because buttons are lame
document.addEventListener( "click", clickListener );

function clickListener(event){
    var element = event.target;
	//get element id
	let id = element.id;


    //TODO UPDATE THIS SECTION
	switch(id){
		case "joinGame":
			console.log(clientID);
			serverws.send(messageFormater("joinGame", clientID));
			break;
		case "changeName":
			//check if we are requesting the change name page or if we are submitting a name change
			if(!document.getElementById("nameInput")){
				serverws.send(messageFormater("navigate", "changeName"));
			}else{
				let name = document.getElementById("nameInput").value;
				document.getElementById("topText").innerHTML = name;
				serverws.send(messageFormater("changeName", name));
			}
		default:
			break;
	}	
}
},{}]},{},[1]);
