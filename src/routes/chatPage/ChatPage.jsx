import "./chatPage.css";
import NewPrompt from "../../components/newPrompt/NewPrompt";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";

const ChatPage = () => {
  const { pathname } = useLocation();
  const chatId = pathname.split("/").pop();

  const { isLoading, isError, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await fetch(`http://ask-nova-backend.vercel.app/api/chats/${chatId}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Something went wrong!</div>;

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {data?.history?.map((message, i) => (
            <div key={i}>
              {message.img && (
                <IKImage
                  urlEndpoint={"https://ik.imagekit.io/Sahil"}
                  path={message.img}
                  height="300"
                  width="400"
                  transformation={[{ height: 300, width: 400 }]}
                  loading="lazy"
                  lqip={{ active: true, quality: 20 }}
                />
              )}
              <div className={message.role === "user" ? "message user" : "message"}>
                <Markdown>{message.parts[0].text}</Markdown>
              </div>
            </div>
          ))}

          {data && <NewPrompt data={data} />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
