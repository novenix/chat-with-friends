
class Editor extends React.Component {
    render() {
        return (
            <div>
                <h1>Hello, {this.props.name}</h1>
                <hr/>
                <div id="toolstatus"/>
                <hr/>
                <div id="container"/>

                <hr/>
                <div id="info"/>

                <div>
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css" integrity="sha256-mmgLkCYLUQbXn0B1SRqzHar6dCnv9oZFPEC1g1cwlkk=" crossOrigin="anonymous" />

                    <link href="../static/css/style.css" thHref="@{/css/style.css}" rel="stylesheet" />
                    <title>Chat</title>
                    <div className="chat-container">
                        <header className="chat-header">
                            <h1>
                                <i className="fas fa-smile" /> ChatRooms
                            </h1>
                            <a thHref="@{index}" className="btn">Leave Room</a>
                        </header>
                        <main className="chat-main">
                            <div className="chat-sidebar">
                                <h3>
                                    <i className="fas fa-comments" /> Room Name:
                                </h3>
                                <h2 thText="${room}" id="room-name" />
                                <div hidden="true" id="username" thText="${username}" />
                                <h3>
                                    <i className="fas fa-users" /> Users
                                </h3>
                                <ul id="users">
                                </ul>
                            </div>
                            <div className="chat-messages">
                            </div>
                        </main>
                        <div className="chat-form-container">
                            <form id="chat-form">
                                <input id="msg" type="text" placeholder="Enter Message" required autoComplete="off" />
                                <button id="send" className="btn">
                                    <i className="" /> Send
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
function ChatServiceURL() {
    return 'ws://localhost:8080/chatService';
}
function URL() {
    return 'ws://localhost:8080/chatService';
}


class WBCanvas extends React.Component {
    constructor(props) {
        super(props);
        this.comunicationWS = new WSBBChannel(WBServiceURL(), (msg) => {
            const obj = JSON.parse(msg);
            console.log("On func call back ", msg);
            this.drawPoint(obj.x, obj.y);
        });
        this.state = {
            value: '',
            chatMessages:[],
            users:[]
        }
        ;

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        //--------------------------------------
        this.usernik;
        this.chatRoom;
        this.users;
        this.sendButton;
        this.chatForm;
        //son todos los mensajes //state
        //this.chatMessages;

        //const usernick = document.getElementById('usernick').innerText;
        //const chatRoom = document.getElementById('room-name').innerText;
        //const users = document.getElementById('users');
        //const sendButton = document.getElementById('send');
        //const chatForm = document.getElementById('chat-form');
        //const chatMessages = document.querySelector('.get-chat-messages');
        this.comunnicationWS = new WSChatChanel (ChatServiceURL(),
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
        this.myp5 = null;
        this.state = {loadingState: 'Loading Canvas ...'}
        let wsreference = this.comunicationWS;
        this.sketch = function (p) {
            let x = 100;
            let y = 100;
            p.setup = function () {
                p.createCanvas(700, 410);
            };
            p.draw = function () {
                if (p.mouseIsPressed === true) {
                    p.fill(0, 0, 0);
                    p.ellipse(p.mouseX, p.mouseY, 20, 20);
                    wsreference.send(p.mouseX, p.mouseY);
                }
                if (p.mouseIsPressed === false) {
                    p.fill(255, 255, 255);
                }
            };
        }
    }
    drawPoint(x, y){
        this.myp5.ellipse(x, y, 20, 20);
    }
    componentDidMount() {
        this.myp5 = new p5(this.sketch, 'container');
        this.setState({loadingState: 'Canvas Loaded'});
    }
    handleChange(event) {
        //añadir mensajes
        this.setState({messages: event.target.value});
        //this.setState({value: this.state.value.append(event.target.value)});
    }

    handleSubmit(event) {
        //hacer un append event.target.value
        var obj={me}
        this.setState(state => {
            const chatMessages = state.chatMessages.concat(event.target.value);

            return {
                chatMessages,
                value: '',
            };
        });
        //llamar al server
        alert('A name was submitted: ' + this.state.value);
        this.comunicationWS.sendToServer()
        comunnicationWS.sendToServer("userMessage",this.state.chatMessages.usernick,this.state.chatMessages.chatRoom,event.target.value);
        event.preventDefault();
    }
    render()
    {
        return(

            <form onSubmit={this.handleSubmit}>
                <label>
                    insert message:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
                <p>You clicked {this.state.count} times</p>

            </form> );
    }
}

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

ReactDOM.render(
    <Editor name="Daniel"/>,
    document.getElementById('root')
);