import React, { useEffect, useRef, useState } from "react";
import styles from "./ChatPage.module.scss";

type Message = {
  sender: "user" | "assistant";
  text: string;
};

type ChatHistory = {
  id: number;
  title: string;
  messages: Message[];
};

const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "";

const ChatPage: React.FC = () => {
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false); // MOBILE SIDEBAR STATE
  const chatWindowRef = useRef<HTMLDivElement | null>(null);

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;

  const createNewChatWithReturnId = (): number => {
    const maxId = chats.length ? Math.max(...chats.map((c) => c.id)) : 0;
    const newId = maxId + 1;

    const newChat: ChatHistory = {
      id: newId,
      title: `Chat ${newId}`,
      messages: [],
    };

    setChats((prev) => [...prev, newChat]);
    setActiveChatId(newId);

    return newId;
  };

  useEffect(() => {
    const t = setTimeout(() => {
      if (chatWindowRef.current) {
        chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
      }
    }, 50);
    return () => clearTimeout(t);
  }, [chats, activeChatId]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    let targetChatId = activeChatId;
    if (!targetChatId) {
      targetChatId = createNewChatWithReturnId();
    }

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === targetChatId
          ? { ...chat, messages: [...chat.messages, { sender: "user", text: trimmed }] }
          : chat
      )
    );

    setInput("");

    try {
      const res = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_message: trimmed,
          thread_id: `thread-${targetChatId}`,
        }),
      });

      if (!res.ok || !res.body) {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === targetChatId
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    { sender: "assistant", text: "⚠️ Error: server unreachable" },
                  ],
                }
              : chat
          )
        );
        return;
      }

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === targetChatId
            ? {
                ...chat,
                messages: [...chat.messages, { sender: "assistant", text: "" }],
              }
            : chat
        )
      );

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });

        setChats((prev) =>
          prev.map((chat) => {
            if (chat.id !== targetChatId) return chat;
            const msgs = [...chat.messages];
            msgs[msgs.length - 1] = { sender: "assistant", text: accumulated };
            return { ...chat, messages: msgs };
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className={styles["chat-page"]}>
      
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.visible : ""}`}
      >
        <button
          className={styles["new-chat-btn"]}
          onClick={createNewChatWithReturnId}
        >
          + New Chat
        </button>

        <div className={styles["chat-history"]}>
          {chats.length === 0 ? (
            <div className={styles["no-chats"]}>No chats yet — start a new chat</div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`${styles["chat-item"]} ${
                  chat.id === activeChatId ? styles.active : ""
                }`}
                onClick={() => {
                  setActiveChatId(chat.id);
                  setSidebarOpen(false);
                }}
              >
                {chat.title}
              </div>
            ))
          )}
        </div>
      </aside>


      <div className={styles["chatbot-container"]}>
        
        <div className={styles["chat-window"]} ref={chatWindowRef}>
          
          <div className={styles["chat-header"]}>Thinkora Chatbot 🤖</div>

          {activeChat && activeChat.messages.length > 0 ? (
            activeChat.messages.map((msg, idx) => (
              <div key={idx} className={`${styles.message} ${styles[msg.sender]}`}>
                {msg.text}
              </div>
            ))
          ) : (
            <div className={styles["no-chat"]}>
              {chats.length === 0
                ? "Click + New Chat to start."
                : "Select a chat or send a message below."}
            </div>
          )}

       
          <div className={styles["chat-input"]}>
            
           
            <button
              className={styles["mobile-menu-btn"]}
              onClick={() => setSidebarOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                  <rect width="18" height="18" x="3" y="3" rx="2"/>
                  <path d="M9 3v18m5-12l3 3l-3 3"/>
                </g>
              </svg>
            </button>

            <input
              value={input}
              placeholder="Type a message..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button onClick={sendMessage}>Send</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChatPage;
