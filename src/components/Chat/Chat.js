import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client' 
import './Chat.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messsages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

let socket;

const Chat = ({location}) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    const ENDPOINT = 'https://chat-app-backend-6q3v.onrender.com';

    useEffect(()=>{
        const {name, room} = queryString.parse(location.search);

        socket = io(ENDPOINT);
 
        setName(name);
        setRoom(room);

        socket.emit('join', {name,room}, (error) => {
            if(error){
                alert(error);
            }
        });
      },[ENDPOINT, location.change])
    
    useEffect(() => {
        socket.on('message', (message) => {
            setMessages(messages => [...messages, message]);
        });
        socket.on("roomData", ({users}) => {
            setUsers(users);
        });
    }, []);

    const sendMessage = (event) => {
        event.preventDefault();
        if(message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    console.log(message, messages)

    return(
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/>
                <Messsages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
            <TextContainer users={users}/>
        </div>
    )
}

export default Chat;
//frontend