import React, { useEffect, useRef, useState } from 'react';
import { View, Button, TextInput, FlatList, Text } from 'react-native';

export default function ChatScreen() {
  const wsRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const url = "ws://localhost:8000/ws/chat";
    const ws = new WebSocket(url);
    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join", room: "global", sender_id: 7, sender_name: "MobileUser" }));
    };
    ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      setMessages((m) => [...m, data]);
    };
    ws.onerror = (e) => console.warn("WS error", e.message);
    ws.onclose = () => console.log("WS closed");
    return () => { ws.close(); };
  }, []);

  const send = () => {
    if (!wsRef.current) return;
    wsRef.current.send(JSON.stringify({ type: "message", room: "global", content: text, sender_id: 7, sender_name: "MobileUser" }));
    setText("");
  };

  return (
    <View style={{flex:1, padding:16}}>
      <FlatList data={messages} renderItem={({item})=> <Text style={{color:'#fff'}}>{item.sender_name || 'sys'}: {item.content}</Text>} keyExtractor={(i, idx) => String(idx)} />
      <TextInput value={text} onChangeText={setText} placeholder="Mensagem..." style={{borderWidth:1, borderColor:'#444', color:'#fff', marginVertical:8, padding:8}} />
      <Button title="Enviar" onPress={send} />
    </View>
  );
}
