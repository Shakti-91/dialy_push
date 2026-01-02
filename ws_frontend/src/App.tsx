import { useEffect, useRef, useState } from 'react'

import './App.css'

function App() {
  const [socket, setSocket] = useState();
  const messageRef=useRef<HTMLInputElement|null>(null);
  function SendMessage(mess:string|undefined){
    if(socket)
      //@ts-ignore
     socket.send(mess);
  }

  useEffect(()=>{
    const ws= new WebSocket("ws://localhost:8080");
   //@ts-ignore
    setSocket(ws);
    ws.onmessage=(e)=>{
      alert(e.data); 
    }
  },[])

  return (
    <>
      
      <div>
        <input ref={messageRef} type="text" placeholder='Message..' />
        <button onClick={()=>SendMessage(messageRef.current?.value)}>Send</button>
      </div>
    </>
  )
}

export default App
