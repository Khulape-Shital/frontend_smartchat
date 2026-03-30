"use client";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import styles from "./sidebar.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import useModel from "../../context/ModelContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchModels } from "@/redux/thunkSlice/modelsthunk";
import {setSelectedModel} from "@/redux/thunkSlice/modelsSlice";
import {
  getChats,
  createChat,
  deleteChat,
  updateChatTitle,
  model_selection,
  get_models,
} from "@/services/chatService";
import {
  SIDEBAR,
  ERROR_MESSAGES,
  STORAGE_KEYS,
  ROUTES,
  APP_NAME,
} from "@/lib/constants";

export default function Sidebar({
  open,
  setOpen,
  selectedChatId,
  onSelectChat,
  onNewChat,
  refreshTrigger,
}) {
  const [chats, setChats] = useState([]);
  const [username, setUsername] = useState("");
  const [userPicture, setUserPicture] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const router = useRouter();
  // const [models, setModels]= useState([])
  // const { selected, setSelected } = useModel();

 
  // const fetchModels =async()=>{
  //   try{
  //     const res = await get_models();
  //     console.log("Models API:", res); 
  //     setModels(res||[]);
  //    }catch{
  //     console.log("Modells not found");
      
  //    }
  // }

  const dispatch = useDispatch();

const { models, selected } = useSelector(
  (state) => state.models
);


  
  useEffect(() => {
    console.log(selected);
  }, [selected]);
  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    router.push(ROUTES.LOGIN);
  };

  const fetchChats = async () => {
    try {
      const res = await getChats();
      setChats(res || []);
    } catch (err) {
      console.error(ERROR_MESSAGES.LOAD_CHATS, err);

      if (err?.response?.status !== 401) {
        console.log("Error fetching chats:", err);
      }
    }
  };


  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const userString = localStorage.getItem(STORAGE_KEYS.USER);

    if (!token) {
      router.push(ROUTES.LOGIN);
      return;
    }

    if (userString) {
      try {
        const userData = JSON.parse(userString);
        setUsername(userData.name || "");

        setUserPicture(userData.profile_picture || null);
      } catch {
        console.error("Failed to parse user data");
      }
    }

    fetchChats();
    dispatch(fetchModels())
  }, [router]);

  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchChats();
    }
  }, [refreshTrigger]);

  const handleNewChat = async () => {
    onNewChat?.(null);
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    try {
      await deleteChat(chatId);
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      if (selectedChatId === chatId) onSelectChat?.(null);
    } catch (err) {
      console.error(ERROR_MESSAGES.DELETE_CHAT, err);
    }
  };

  const startRename = (e, chat) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const confirmRename = async (e, chatId) => {
    e.stopPropagation();
    const title = editTitle.trim();
    if (!title) return;
    const original = chats.find((c) => c.id === chatId)?.title;

    if (title === original) {
      setEditingChatId(null);
      return;
    }
    try {
      await updateChatTitle(chatId, title);
      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, title } : c)),
      );
    } catch (err) {
      console.error(ERROR_MESSAGES.RENAME_CHAT, err);
    } finally {
      setEditingChatId(null);
    }
  };

  const cancelRename = (e) => {
    e.stopPropagation();
    setEditingChatId(null);
  };

  return (
    <div className={open ? `${styles.sidebar} ${styles.open}` : styles.sidebar}>
      <div className={styles.sidebarHeader}>
        {open && <h2 className={styles.logo}>{APP_NAME}</h2>}

        <Tooltip title={open ? "Collapse sidebar" : "Expand sidebar"}>
          <IconButton
            className={styles.menuBtn}
            onClick={() => setOpen(!open)}
            size="small"
          >
            <MenuIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>

      {/* New Chat */}
      <Tooltip
        title={SIDEBAR.NEW_CHAT_LABEL}
        placement="right"
        disableHoverListener={open}
      >
        {/* {open && (
          <div>
            <select
              className={styles.dropdown}
              value={selected}
              onChange={async (e) => {
                setSelected(e.target.value);
                
              }}
            >
              <option value="">Select Models</option>
              {models.map((model, index) => (
                <option key={index} value={model.model}>
                  {model.model}
                </option>
              ))}
            </select>
          </div>
        )} */}

        {open &&(
          <div>
            <select
             className={styles.dropdown}
             value={selected}
             onChange={(e)=>dispatch(setSelectedModel(e.target.value))}
            >
              <option>Select Moodel</option>
                {models.map((model,index)=>(
                  <option key={index}>{model}</option>
                ))}

              
            </select>
          </div>
        )}
        <button className={styles.button} onClick={handleNewChat}>
          <AddIcon fontSize="small" />

          {open && <span>{SIDEBAR.NEW_CHAT_LABEL}</span>}
        </button>
      </Tooltip>

      {/* Conversations */}
      <div className={styles.conversations}>
        {open && (
          <p className={styles.conversationtitle}>{SIDEBAR.RECENT_LABEL}</p>
        )}

        {chats.map((chat) => (
          <div
            className={`${styles.conversationItem} ${
              selectedChatId === chat.id ? styles.activeChat : ""
            }`}
            key={chat.id}
            onClick={() => onSelectChat?.(chat.id)}
          >
            <ChatIcon sx={{ fontSize: 18, flexShrink: 0 }} />

            {open &&
              (editingChatId === chat.id ? (
                <div
                  className={styles.renameRow}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    className={styles.renameInput}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") confirmRename(e, chat.id);
                      if (e.key === "Escape") cancelRename(e);
                    }}
                    autoFocus
                  />
                  <Tooltip title={SIDEBAR.SAVE_LABEL}>
                    <IconButton
                      size="small"
                      className={styles.iconBtn}
                      onClick={(e) => confirmRename(e, chat.id)}
                    >
                      <CheckIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={SIDEBAR.CANCEL_LABEL}>
                    <IconButton
                      size="small"
                      className={styles.iconBtn}
                      onClick={cancelRename}
                    >
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Tooltip>
                </div>
              ) : (
                <div className={styles.chatRow}>
                  <Tooltip title={chat.title} placement="right" arrow>
                    <span
                      className={styles.chatTitle}
                      onDoubleClick={(e) => startRename(e, chat)}
                    >
                      {chat.title}
                    </span>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      className={styles.iconBtn}
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                    >
                      <DeleteIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Tooltip>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={styles.sidebarFooter}>
        <div className={styles.user}>
          <div className={styles.avatar}>
            {userPicture ? (
              <img
                src={userPicture}
                alt="avatar"
                className={styles.avatarImg}
              />
            ) : (
              <PersonIcon sx={{ fontSize: 16 }} />
            )}
          </div>
          {open && (
            <div>
              <p>Model:{selected}</p>
              <p className={styles.username} title={username}>
                {username}
              </p>
            </div>
          )}
        </div>

        {open && (
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogoutIcon sx={{ fontSize: 16 }} /> {SIDEBAR.LOGOUT_LABEL}
          </button>
        )}
      </div>
    </div>
  );
}
