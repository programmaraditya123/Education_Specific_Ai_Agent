import React, { useState } from "react";
import styles from "./ChatPage.module.scss";

type Message = {
  sender: "user" | "bot";
  text: string;
};

type ChatHistory = {
  id: number;
  title: string;
  messages: Message[];
};

const ChatPage: React.FC = () => {
  const [chats, setChats] = useState<ChatHistory[]>([
    {
      id: 1,
      title: "Chat 1",
      messages: [
        {
          sender: "bot",
          text: "Hi 👋, I’m your assistant. How can I help you today?",
        },
      ],
    },
  ]);

  const [activeChatId, setActiveChatId] = useState(1);
  const [input, setInput] = useState("");

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const sendMessage = () => {
    if (!input.trim() || !activeChat) return;

    const newMessage: Message = { sender: "user", text: input };

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );
    setInput("");

    // Fake bot response
    setTimeout(() => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { sender: "bot", text: "I got your message 👍" },
                ],
              }
            : chat
        )
      );
    }, 1000);
  };

  const handleNewChat = () => {
    const newId = chats.length + 1;
    const newChat: ChatHistory = {
      id: newId,
      title: `Chat ${newId}`,
      messages: [
        {
          sender: "bot",
          text: "Hi 👋, I’m your assistant. How can I help you today?",
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
      <div className={styles["chatbot-container"]}>
        <div className={styles["chat-header"]}>Thinkora Chatbot 🤖</div>

        <div className={styles["chat-window"]}>
          {activeChat?.messages.map((msg, i) => (
            <div key={i} className={`${styles.message} ${styles[msg.sender]}`}>
              {msg.text}
            </div>
          ))}
        </div>

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
      </div>
    </div>
  );
};

export default ChatPage;
