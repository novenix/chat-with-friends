

const usernick = document.getElementById('usernick').innerText;
const chatRoom = document.getElementById('room-name').innerText;
const users = document.getElementById('users');
const sendButton = document.getElementById('send');
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.get-chat-messages');

class WSChatChanel {
    constructor(URL, callback){

        this.URL = URL;
        this.wsocket = new WebSocket(URL);
        this.wsocket.onopen = (evt) => this.onOpen(evt);
        this.wsocket.onmessage = (evt) => this.onMessage(evt);
        this.wsocket.onError = (evt) => this.onError(evt);
        this.received = callback;
    }

    onOpen(evt){
        console.log("On Open: ",evt);
    }

    onError(evt){
        console.log("On Error: ",evt);
    }


    onMessage(evt){
        console.log("On Message: ",evt);
        if(evt.data != "Connection established."){
            this.received(evt.data);
        }
    }

    sendToServer(tipo,user,room,message){
        let msg = `{  "room": "${room}" , "usernick": "${user}" , "messageUser": "${message}" , "typeMessage": "${tipo}" }`;
        this.wsocket.send(msg);

    }
}





let comunnicationWS = new WSChatChanel (ChatServiceURL(),
    (msg) => {
        var mensaje = JSON.parse(msg);
        // console.log("El JSON: ",mensaje);
        if(mensaje.tipo == "userMessage"){
            userMessage(mensaje);
        }else if(mensaje.userList){
            showUserList(mensaje.userList);
        } else{
            botMessage(mensaje);
        }


    });


function showUserList(userList){
    users.innerHTML = `${userList.map(usr => `<li>${usr}</li>`).join('')}`;
}

function botMessage(mensaje){
    const div = document.createElement('div');
    div.classList.add('messageUser');
    console.log(mensaje,"1")
    console.log(mensaje.typeMessage,"2",mensaje.usernick)
    console.log(mensaje.time,"3",mensaje.messageUser)
    div.innerHTML = `<p class="meta">${mensaje.typeMessage} <span> ${mensaje.time}</span></p>
		
		<p class="text">${mensaje.usernick}  ${mensaje.messageUser}</p>
	`;
    console.log(div,"div",chatMessages)
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function userMessage(mensaje){

    const div = document.createElement('div');
    div.classList.add('messageUser');

    div.innerHTML = `<p class="meta">${mensaje.usernick} <span> ${mensaje.time}</span></p>
		
		<p class="text">${mensaje.messageUser}</p>
	`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
function ChatServiceURL() {
    return 'ws://localhost:8080/backend';
}


chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Para que no se actualice la pagina
    const msg = e.target.elements.msg.value;

    comunnicationWS.sendToServer("userMessage",usernick,chatRoom,msg);
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();

});


comunnicationWS.onOpen = () => comunnicationWS.sendToServer("AutomaticResponse",usernick,chatRoom,"Se unió al grupo");


window.addEventListener('beforeunload',() => {
    comunnicationWS.sendToServer("AutomaticResponse",usernick,chatRoom,"Se ha ido del grupo.");
});