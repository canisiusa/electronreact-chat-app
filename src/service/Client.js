import { io } from "socket.io-client";
//import {URL} from "../../Server"
const URL = 'http://192.168.43.139:5765'
const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;

