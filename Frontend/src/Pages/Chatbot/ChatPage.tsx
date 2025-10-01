import React, { useState } from "react";
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

const ChatPage: React.FC = () => {
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [input, setInput] = useState("")
  const [firstChat,setFirstChat] = useState<string>("") || undefined;

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const sendMessage = async () => {
    if (!input.trim() || !activeChatId) return;

    if (firstChat === "" && !activeChatId) setFirstChat(input);
    const user_Message: Message = { sender: "user", text: input };
    const currentInput = input;
    setInput("");

    // 1️⃣ Add user message immediately
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, user_Message] }
          : chat
      )
    ); 

    try {
      // 2️⃣ Call backend
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_message: currentInput,
          thread_id: `thread-${activeChatId}`,
        }),
      });

      const data = await res.json();

      //Append assistant reply
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [...chat.messages, { sender: "assistant", text: data }],
              }
            : chat
        )
      );
    } catch (err) {
      console.error("Chat API ERROR", err);
      // Add error message to chat so user sees feedback
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

        <div className={styles["chat-window"]}>
          {activeChat ? (
            activeChat.messages.map((msg, i) => (
              <div key={i} className={`${styles.message} ${styles[msg.sender]}`}>
                {msg.text}
              </div>
            ))
          ) : (
            <div className={styles["no-chat"]}>Start a new chat to begin!</div>
          )}
        </div>
        

        {activeChat && (
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
      : <div className={styles.firstChat}>
        <div className={styles["chat-input"]}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
            />
            <button onClick={() => sendMessage()}>Send</button>
          </div>
       
    </div>}
    

    </div>
  );
};

export default ChatPage;
