import { Key, useEffect, useRef, useState } from "react";
import { useTitle } from "../../context/TitleContext";
import { useChat } from "../../context/ChatContext";
import { FaPaperPlane, FaSearch, FaThumbtack } from "react-icons/fa";
import { Document, Page } from "react-pdf";
import { DateTime } from "luxon";
// import { DateTime } from "luxon";
import { CiMenuFries } from "react-icons/ci";
import { MdKeyboardVoice } from "react-icons/md";
import { MdPushPin } from "react-icons/md";
import { useSidebar } from "../../context/SidebarContext";
import pusher from "../../utils/pusher";
import {
  useGetAllChatsQuery,
  useGetCurrentUserChatSessionQuery,
  useInsertClientMesageThroughAppMutation,
  useLazyGetCurrentUserChatSessionQuery,
} from "../../redux/chat/chatApi";
import { useSelector } from "react-redux";
import selectFile from "./file.png";
import toast from "react-hot-toast";
import { RiVoiceRecognitionFill } from "react-icons/ri";

export default function Chat() {
  const user = useSelector((state) => state.auth?.user);
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [multipleFiles, setMultipleFiles] = useState<File[]>([]);
  const scrollRef = useRef(null);
  const { setTitle } = useTitle();
  const [isSessionEnd, setIsSessionEnd] = useState(true);
  const [realTimeMessages, setRealTimeMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(0);
  const {
    data: getAllChats,
    isLoading: getAllChatLoading,
    refetch: getAllChatsReftech,
    isFetching: getAllChatsFeching,
  } = useGetAllChatsQuery({ id: user?.agent_user_id, page });

  const result = getAllChats?.result;
  const [messages, setMessages] = useState(getAllChats?.result || []);

  const {
    data: currentUserChatSession,
    isLoading: currentUserChatSessionLoading,
    error: currentUserChatSessionError,
  } = useGetCurrentUserChatSessionQuery(user?.agent_user_id);
  const [
    getChatLazySession,
    { isLoading: getChatLazySessionLoading, isError: getChatLazySessionError },
  ] = useLazyGetCurrentUserChatSessionQuery();
  const [insertMesage, { isLoading: insertMessageLoading }] =
    useInsertClientMesageThroughAppMutation();

  const { isMobileOpen, toggleMobileSidebar } = useSidebar();
  useEffect(() => {
    setTitle("Chat");
  }, [setTitle]);

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

//  console.log("AUdio Url", audioUrl)
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  const startRecording = async () => {
    try {
      console.log("Start")
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
  
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
  
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        setRecordedBlob(audioBlob); 
      };
  
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    if (files.length === 1) {
      // Single file selected
      setSingleFile(files[0]); // You can save full file object, not just value
      console.log("Single File Selected:", files[0]);
    } else if (files.length > 1) {
      // Multiple files selected
      const filesArray = Array.from(files);
      setMultipleFiles(filesArray);
      console.log("Multiple Files Selected:", filesArray);
    }
  };

  // console.log("multipleFiles", multipleFiles)
  const handleSend = () => {
    if (!message.trim() && !singleFile && !multipleFiles && !recordedBlob) return;

    const tempId = Date.now(); // generate temporary unique ID
    const now = DateTime.local();
    const formattedDate = DateTime.local().toFormat("M/d/yyyy");
    const msgfile = singleFile
      ? URL.createObjectURL(singleFile)
      : multipleFiles.length > 0
      ? multipleFiles.map((file) => URL.createObjectURL(file))
      : null;
    const newMessage = {
      id: tempId,
      message: message.trim() || "", // if only file, message might be empty
      msgfile: msgfile ? msgfile : recordedBlob,
      messagefrom: user?.agent_user_id,
      orderSummary: null,
      msgstatus: "sending", // optional
      date: formattedDate,
      time: DateTime.local().toFormat("h:mm a"),
      respondTo: null,
    };

    console.log("New Message", newMessage);
    // return
    // Optimistically update UI
    setMessages((prev) => [...prev, newMessage]);

    // Send to server
    const formData = new FormData();
    formData.append("clientid", user?.agent_user_id);
    formData.append("msg", message.trim());
    if (singleFile) {
      formData.append("filemsg[]", singleFile);
    }
    if (multipleFiles.length > 0) {
      multipleFiles.forEach((file) => {
        formData.append("filemsg[]", file);
      });
    }
    if (recordedBlob) {
      formData.append("filemsg[]", recordedBlob, "voice-recording.webm"); // important to give filename
    }
    insertMesage(formData);
    setAudioUrl(null)
    setRecordedBlob(null)
    setSingleFile(null);
    setMultipleFiles([]);
    setMessage(""); // clear input
  };
  const groupMessagesByDate = (messages: any[]) => {
    const sections = {};
    messages.forEach((msg: { date: string }) => {
      if (!msg?.date || typeof msg.date !== "string") {
        console.warn("⚠️ Invalid msg.date:", msg);
        return; // Skip bad messages
      }

      let parsedDate: DateTime;
      if (msg.date.includes("-")) {
        // "2025-04-28" format
        parsedDate = DateTime.fromISO(msg.date);
      } else if (msg.date.includes("/")) {
        // "4/28/2025" format
        parsedDate = DateTime.fromFormat(msg.date, "M/d/yyyy");
      } else {
        console.warn("⚠️ Unknown date format:", msg.date);
        return; // Skip
      }

      if (!parsedDate.isValid) {
        console.error("❌ Parsed date invalid:", msg.date);
        return;
      }

      const groupDate = parsedDate.toFormat("yyyy-MM-dd");

      if (!sections[groupDate]) sections[groupDate] = [];
      sections[groupDate].push(msg);
    });

    return Object.entries(sections)
      .sort(
        ([a], [b]) =>
          DateTime.fromISO(a).toMillis() - DateTime.fromISO(b).toMillis()
      )
      .map(([date, data]) => ({
        date,
        data: data.sort((a: { time: string }, b: { time: string }) => {
          const timeA = DateTime.fromISO(a.time);
          const timeB = DateTime.fromISO(b.time);
          return timeA.toMillis() - timeB.toMillis();
        }),
      }));
  };
  const formatDateLabel = (isoDate: string) => {
    const date = DateTime.fromFormat(isoDate, "yyyy-MM-dd"); // safer
    const today = DateTime.local();

    if (date.hasSame(today, "day")) return "Today";
    if (date.plus({ days: 1 }).hasSame(today, "day")) return "Yesterday";

    return date.toFormat("MMMM dd, yyyy");
  };

  // const handleScroll = ()=>{
  //   console.log("Scroll STart")
  // }

  const handleScroll = (e: { target: { scrollTop: any } }) => {
    const { scrollTop } = e.target;

    if (scrollTop < 500 && !getAllChatsFeching) {
      // Near the top, fetch more
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.id) {
        setPage(lastMessage.id);
      }
    }
  };

  useEffect(() => {
    if (getAllChats?.result) {
      setMessages(getAllChats?.result);
    }
  }, [getAllChats]);


 useEffect(() => {
  const channel = pusher.subscribe("demo_pusher");
  channel.bind_global((eventName: string, data: any) => {
    const chatMessage = {
      id: data?.message?.mid,
      message: data?.message?.msg,
      msgfile: data?.message?.msgfile,
      messagefrom: data?.message?.msgfrom,
      orderSummary: data?.message?.orderSummary,
      msgstatus: data?.message?.msgstatus,
      date: data?.message?.msgdate,
      time: data?.message?.tsdate,
      respondTo: data?.message?.respondTo,
    };

    setMessages((prev) => {
      const alreadyExists = prev.some((m) => m.id === chatMessage.id);
      if (alreadyExists) return prev;

      // Remove optimistic message with same content
      const filtered = prev.filter((m) =>
        m.msgstatus === "sending" &&
        m.message === chatMessage.message &&
        m.messagefrom === chatMessage.messagefrom
          ? false
          : true
      );
      return [...filtered, chatMessage];
    });
  });

  return () => {
    channel.unbind_all();
    channel.unsubscribe();
  };
}, []);



  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current as HTMLElement;
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: "auto",
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-auto lg:h-full relative">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:h-[88px] px-6 py-6 bg-white justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <img
            src={"https://randomuser.me/api/portraits/men/1.jpg"}
            alt={"Customer Support"}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="font-bold text-md">"Customer Support"</div>
        </div>
        <div className="relative w-[240px]">
          <input
            type="text"
            placeholder="Search"
            className="border px-4 py-1.5 pr-10 rounded text-sm w-full"
          />
          <FaSearch className="absolute top-2.5 right-3 text-gray-400" />
        </div>
      </div>

      {/* Pinned Message */}
      <div className="bg-teal-700 flex items-center justify-between text-white text-sm py-2 px-4">
        <div className="flex items-center gap-2">
          <MdPushPin size={21} /> Lorem ipsum dolor sit amet consectetur....
        </div>
        <div className="">
          <button
            className="lg:hidden text-red-700"
            onClick={toggleMobileSidebar}
          >
            <CiMenuFries size={26} />
          </button>
        </div>
      </div>

      {/* Message Area */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto max-h-[550px] px-2 pt-8 pb-32 space-y-4 bg-[#f5f5f5]"
      >
        {groupMessagesByDate(messages).map((section, sectionIndex) => (
          <div key={sectionIndex} className="mt-4">
            <div className="text-center mb-2 text-xs text-gray-500 font-semibold">
              {formatDateLabel(section.date)}
            </div>

            {section.data.map(
              (
                msg: {
                  messagefrom: any;
                  message: string;
                  msgfile: any;
                  id: Key | null | undefined;
                },
                index: any
              ) => {
                const isUser = msg.messagefrom === user?.agent_user_id;
                const message = msg.message?.trim();
                const msgfile = msg.msgfile;

                // Determine file type
                const isImage = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(
                  msgfile
                );
                const isDocument = /\.(pdf|docx?|xlsx?|pptx?|zip)$/i.test(
                  msgfile
                );
                const isVoice = /\.(mp3|mp4|wav|ogg|webm)$/i.test(msgfile);
                let msgfiles = Array.isArray(msgfile) ? msgfile : [msgfile];
                let files = Array.isArray(msgfile) ? msgfile : [];
                let msgArray = [];
                let voiceArray = [];
                if (
                  Array.isArray(msgfiles) &&
                  msgfiles.length > 0 &&
                  typeof msgfiles[0] === "string"
                ) {
                  try {
                    // Check if it’s a JSON string (starts with [ and ends with ])
                    const trimmed = msgfiles[0].trim();
                    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
                      msgArray = JSON.parse(trimmed);
                    } else {
                      msgArray = [msgfiles[0]]; // fallback as single file string
                    }
                  } catch (err) {
                    console.error(
                      "❌ Invalid JSON in msgfiles[0]:",
                      msgfiles[0]
                    );
                    msgArray = [];
                  }
                }
                const isBlobUrl = msgfile?.startsWith("blob:");
                return (
                  <div
                    key={msg.id + sectionIndex}
                    className={`flex w-full ${
                      isUser ? "justify-end" : "justify-start"
                    } px-2 mb-1`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-lg  shadow-sm ${
                        isUser
                          ? "bg-teal-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {message && (
                        <div>
                          {message}
                          <div className="text-[10px] text-gray-300">
                            {msg.time}
                          </div>
                        </div>
                      )}

                      {/* Handle media messages */}
                      {!message && msgfile && (
                        <div className="mt-1">
                          {isImage && msgfile ? (
                            <>
                              <img
                                src={isBlobUrl ? msgfile : `https://staging.portalteam.org/newchatfilesuploads/${msgfile}`}
                                alt="image"
                                className="max-w-xl rounded-lg"
                              />
                              <div className="text-[10px] text-gray-300">
                                {msg.time}
                              </div>
                            </>
                          ) : isDocument ? (
                            <iframe
                              src={`https://docs.google.com/gview?url=https://staging.portalteam.org/newchatfilesuploads/${msgfile}&embedded=true`}
                              className="w-full h-[500px] rounded-md border"
                              title="Document Viewer"
                            />
                          ) : isVoice ? (
                            <audio controls preload="metadata">
                              <source
                                type="audio/mpeg"
                                src={`https://nabeel.a2hosted.com/newchatfilesuploads/${msgfile}`}
                              />
                              {/* Your browser does not support the audio element. */}
                            </audio>
                          ) : (
                            Array.isArray(msgArray) &&
                            msgArray.length >= 1 &&
                            msgArray.map((img, index) => (
                              <div className="w-full bg-gray-100 my-3 rounded-lg overflow-hidden border flex items-center justify-center">
                                <img
                                  key={index}
                                  src={`https://staging.portalteam.org/newchatfilesuploads/${img}`}
                                  alt="chat-image"
                                  className="rounded-lg max-w-xs mb-2 object-contain"
                                />
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        ))}
      </div>
      {/* Input */}
      <div className="pe-18 pb-4 ps-4 lg:fixed lg:bottom-0 w-full lg:w-[85vw] flex gap-2">
        {singleFile && (
          <div className="absolute bottom-full mb-4 w-64 bg-white border rounded-lg shadow-lg p-4 flex flex-col items-center">
            <div className="relative w-full flex justify-end">
              <button
                onClick={() => setSingleFile(null)}
                className="text-red-500 hover:text-red-700"
              >
                ❌
              </button>
            </div>
            <img
              src={URL.createObjectURL(singleFile)}
              alt="Selected"
              className="w-36 h-36 mt-2"
            />
            <div className="text-sm text-gray-600 mt-2">{singleFile.name}</div>
          </div>
        )}
        {multipleFiles.length > 1 && (
          <div className="absolute bottom-full mb-4 w-64 bg-white border rounded-lg shadow-lg p-4 flex flex-col items-center">
            <div className="relative w-full flex justify-end">
              <button
                onClick={() => setMultipleFiles([])}
                className="text-red-500 hover:text-red-700"
              >
                ❌
              </button>
            </div>
            {multipleFiles.map((file, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Selected ${index}`}
                  className="w-full h-24"
                />
                <div className="text-[10px] text-gray-600 mt-1">
                  {file.name.length > 10
                    ? file.name.slice(0, 10) + "..."
                    : file.name}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="p-3 border w-1/1 rounded-md border-[#6da5f9] flex items-center gap-3 bg-white">
          <input
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            value={message}
            placeholder={audioUrl ? "audio" :"Type your message"}
            className="w-full px-4 py-2 rounded-full text-sm outline-none"
          />
          <div className="!cursor-pointer relative ">
            <input
              type="file"
              multiple
              id="fileUpload"
              onChange={(event) => handleChange(event)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <img
              src={selectFile}
              alt="Select file"
              className="w-[24px] h-[24px] object-cover"
            />
          </div>



          <button  onClick={isRecording ? stopRecording : startRecording} className="bg-teal-600 text-white p-2 w-[48px] h-[48px] flex items-center justify-center rounded-full">
              {isRecording ? <RiVoiceRecognitionFill /> : <MdKeyboardVoice size={26} />}
            </button>
        </div>
        <div className="w-1/12 flex items-center">
            <button
              onClick={handleSend}
              className="bg-teal-600 text-white p-2 w-[48px] h-[48px] flex items-center justify-center rounded-full"
            >
              <FaPaperPlane size={16} />
            </button>
        </div>
      </div>
    </div>
  );
}
