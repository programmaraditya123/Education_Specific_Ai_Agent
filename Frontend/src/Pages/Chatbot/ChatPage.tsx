import React, { useEffect, useRef, useState } from "react";
import styles from "./ChatPage.module.scss";

type Message = {
  sender: "user" | "assistant";
  text: string ;
};

type ChatHistory = {
  id: number;
  title: string;
  messages: Message[];
};

const BASE_URL = import.meta.env.VITE_BACKEND_URL

const ChatPage: React.FC = () => {
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [input, setInput] = useState("")
  const [firstChat,setFirstChat] = useState<string>("") || undefined;
  const chatWindowRef = useRef<HTMLDivElement | null>(null);

  const activeChat = chats.find((chat) => chat.id === activeChatId);
  console.log("************",activeChat)

  // const sendMessage = async () => {
  //   if (!input.trim() || !activeChatId) return;

  //   if (firstChat === "" && !activeChatId) setFirstChat(input);
  //   const user_Message: Message = { sender: "user", text: input };
  //   const currentInput = input;
  //   setInput("");

  //   // 1️⃣ Add user message immediately
  //   setChats((prevChats) =>
  //     prevChats.map((chat) =>
  //       chat.id === activeChatId
  //         ? { ...chat, messages: [...chat.messages, user_Message] }
  //         : chat
  //     )
  //   ); 

  //   try {
  //     // 2️⃣ Call backend
  //     const res = await fetch(`${BASE_URL}/chat`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         user_message: currentInput,
  //         thread_id: `thread-${activeChatId}`,
  //       }),
  //     });

  //     const data = await res.json();

  //     let text = data;
  //     let displayed = "";

  //     for(let i=0;i<text.length;i++){
  //       displayed += text[i]
  //     }

      
  //     // Update assistant's message progressively
  //     setChats((prevChats) =>
  //       prevChats.map((chat) => {
  //         if (chat.id === activeChatId) {
  //           const messages = [...chat.messages];
  //           const lastMsg = messages[messages.length - 1];

  //           // If last message is already assistant, update it
  //           if (lastMsg && lastMsg.sender === "assistant") {
  //             messages[messages.length - 1] = {
  //               ...lastMsg,
  //               text: displayed,
  //             };
  //           } else {
  //             // Otherwise add a new assistant message
  //             messages.push({ sender: "assistant", text: displayed });
  //           }

  //           return { ...chat, messages };
  //         }
  //         return chat;
  //       })
  //     );
  //     await new Promise((r) => setTimeout(r, Math.random() * 20 + 15));

  //   } catch (err) {
  //     console.error("Chat API ERROR", err);
  //     // Add error message to chat so user sees feedback
  //     setChats((prevChats) =>
  //       prevChats.map((chat) =>
  //         chat.id === activeChatId
  //           ? {
  //               ...chat,
  //               messages: [
  //                 ...chat.messages,
  //                 { sender: "assistant", text: "⚠️ Error: Could not reach server" },
  //               ],
  //             }
  //           : chat
  //       )
  //     );
  //   }
  // };
  const sendMessage = async () => {
  if (!input.trim() || !activeChatId) return;

  const currentInput = input;
  setInput("");

  const user_Message: Message = { sender: "user", text: currentInput };

  // Immediately add user message
  setChats((prevChats) =>
    prevChats.map((chat) =>
      chat.id === activeChatId
        ? { ...chat, messages: [...chat.messages, user_Message] }
        : chat
    )
  );

  try {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_message: currentInput,
        thread_id: `thread-${activeChatId}`,
      }),
    });

    if (!res.ok || !res.body) {
      throw new Error("No stream response");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let partialText = "";

    // Add placeholder for assistant
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [...chat.messages, { sender: "assistant", text: "" }],
            }
          : chat
      )
    );

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      partialText += chunk;

      // Update assistant message progressively
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === activeChatId) {
            const messages = [...chat.messages];
            const lastMsg = messages[messages.length - 1];
            if (lastMsg && lastMsg.sender === "assistant") {
              messages[messages.length - 1] = {
                ...lastMsg,
                text: partialText,
              };
            }
            return { ...chat, messages };
          }
          return chat;
        })
      );
    }
  } catch (err) {
    console.error("Chat API ERROR", err);
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { sender: "assistant", text: "⚠️ Error: Could not reach server" },
              ],
            }
          : chat
      )
    );
  }
};


  const handleNewChat = () => {
    setFirstChat("")
    const newId = chats.length + 1;
    const newChat: ChatHistory = {
      id: newId,
      title: `Chat ${newId}`,
      messages: [
        {
          sender: "assistant",
          text: firstChat ,
        },
      ],
    };
    setChats((prevChats) => [...prevChats, newChat]);
    setActiveChatId(newId);
  };

  useEffect(() => {
    if(chatWindowRef.current){
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  },[activeChat?.messages])

  return (
    <div className={styles["chat-page"]}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <button className={styles["new-chat-btn"]} onClick={handleNewChat}>
          + New Chat
        </button>
        <div className={styles["chat-history"]}>
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`${styles["chat-item"]} ${
                chat.id === activeChatId ? styles.active : ""
              }`}
              onClick={() => setActiveChatId(chat.id)}
            >
              {chat.title}
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Window */}
      {firstChat.trim() === ""  ? <div className={styles["chatbot-container"]}>
        <div className={styles["chat-header"]}>Thinkora Chatbot 🤖</div>

        <div className={styles["chat-window"]} ref={chatWindowRef}>
          {activeChat ? (
            activeChat.messages.map((msg, i) => (
              <div key={i} className={`${styles.message} ${styles[msg.sender]}`}>
                {msg.text}
              </div>
            ))
          ) : (
            // <div className={styles["no-chat"]}>Start a new chat to begin!</div>
            <div className={styles["chat-input"]}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
            />
            <button onClick={() => {handleNewChat(),sendMessage()}}>Send</button>
          </div>
          )}
        </div>
        

        {activeChat?.messages && (
          <div className={styles["chat-input"]}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        )}
      </div>
      : 
        <div className={styles["chat-input"]}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message...222"
            />
            <button onClick={() => sendMessage()}>Send</button>
          </div>
       }
    

    </div>
  );
};

export default ChatPage;