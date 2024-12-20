import "./chatPage.css";
import NewPrompt from "../../components/newPrompt/NewPrompt";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage, IKVideo, IKContext } from "imagekitio-react";

const ChatPage = () => {
  const { pathname } = useLocation();
  const chatId = pathname.split("/").pop();

  const { isLoading, isError, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/api/chats/${chatId}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  // Helper function to check if file is an image
  const isImageFile = (filename) => {
    if (!filename) return false;
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    const extension = filename.split(".").pop().toLowerCase();
    return imageExtensions.includes(extension);
  };

  // Helper function to check if file is a video
  const isVideoFile = (filename) => {
    if (!filename) return false;
    const videoExtensions = ["mp4", "webm", "ogg", "mov"];
    const extension = filename.split(".").pop().toLowerCase();
    return videoExtensions.includes(extension);
  };

  const renderMedia = (message) => {
    if (message.filePath) {
      const filePath = message.filePath;

      if (isImageFile(filePath)) {
        return (
          <IKImage
            urlEndpoint={"https://ik.imagekit.io/Sahil"}
            path={filePath}
            height="300"
            width="400"
            transformation={[{ height: 300, width: 400 }]}
            loading="lazy"
            lqip={{ active: true, quality: 20 }}
          />
        );
      } else if (isVideoFile(filePath)) {
        return (
          <IKContext urlEndpoint="https://ik.imagekit.io/Sahil">
            <IKVideo
              className="ikvideo-with-tr"
              path={filePath}
              transformation={[{ height: 200, width: 600, b: "5_red", q: 95 }]}
              controls={true}
            />
          </IKContext>
        );
      }
    }
    return null;
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Something went wrong!</div>;

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          {data?.history?.map((message, i) => (
            <div key={i}>
              {renderMedia(message)}
              <div
                className={
                  message.role === "user" ? "message user" : "message"
                }
              >
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
