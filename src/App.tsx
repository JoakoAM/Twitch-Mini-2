import { Button, Center, Container, Input, Text } from '@chakra-ui/react'
import './App.css'
import { useEffect, useState } from 'react'
import { PiMaskSadBold } from "react-icons/pi";
import { useForm } from 'react-hook-form'
interface FormValues {
  streamer_Name: string
  streamer_Video: string
}
function App() {
  const parent = "localhost"
  const heighStream = 480
  const weightStream = 720
  const heightChat = 480
  const weightChat = 300
  const [streamerName, setStreamerName] = useState("illojuan")
  const [streamerVideo, setStreamerVideo] = useState("")
  const [offlineImage, setOfflineImage] = useState<string>("")

  useEffect(() => {
    if (!streamerName) return;
    fetch(`https://twitchbackend-jkcr.onrender.com/offline-image/${streamerName}`)
      .then(res => res.json())
      .then(data => {
        if (data.url) {
          setOfflineImage(data.url);
        } else {
          setOfflineImage("");
        }
      })
      .catch(() => setOfflineImage(""));
  }, [streamerName]);

  useEffect(() => {
    if (!streamerVideo) return;
    fetch(`https://twitchbackend-jkcr.onrender.com/offline-image-from-video/${streamerVideo}`)
      .then(res => res.json())
      .then(data => {
        if (data.url) {
          setOfflineImage(data.url);
        } else {
          setOfflineImage("");
        }
      })
      .catch(() => setOfflineImage(""));
  }, [streamerVideo]);

  const {
    register,
    handleSubmit,
  } = useForm<FormValues>()
  const onSubmitStreamer = handleSubmit((data) => {
    setStreamerName(data.streamer_Name)
    setStreamerVideo("")
  })
  const onSubmitVideo = handleSubmit((data) => {
    setStreamerVideo(data.streamer_Video)
    setStreamerName("")
  })
  return (

    <>

      <Container position="fixed"
        w={"100%"}
        h={"100vh"}
        backgroundImage={offlineImage ? `url(${offlineImage})` : "#000000"}
        filter="blur(8px)"
        transform="scale(1.1)"
      >
      </Container>

      <Center>
        <Container centerContent w={"100%"}>
          <Container left={"200px"} zIndex={"9999"} position={"fixed"} pt={"40px"} w={"500px"}>
            <Text color={'white'}>¿Quieres cambiar de streamer?</Text>
            <form onSubmit={onSubmitStreamer}>
              <Input bg={'whiteAlpha.700'} w={"200px"} {...register("streamer_Name")} />
              <Button type="submit" ml={"30px"}>Cambiar streamer</Button >
            </form>
          </Container>
          <Container left={"300px"} position={"fixed"} pt={"19px"} pl={"500px"}>
            <Text color={'white'}>¿Quieres ver un video?, para eso necesitas el ID.</Text>
            <Text color={'white'}>EJ: https://www.twitch.tv/videos/123456789 el ID seria 123456789</Text>
            <form onSubmit={onSubmitVideo}>
              <Input bg={'whiteAlpha.700'} w={"200px"} {...register("streamer_Video")} />
              <Button type="submit" ml={"30px"}>Ver video</Button >
            </form>
          </Container>
          <Center h={"100vh"} w={"100%"}>
            {streamerVideo ? <>
              <Container left={"140px"}>
                <iframe
                  src={`https://player.twitch.tv/?video=${streamerVideo}&parent=${parent}`}
                  height={`${heighStream}px`}
                  width={`${weightStream}px`}
                  allowFullScreen
                >
                </iframe>
              </Container>
              <Container right={"230px"} justifyContent={"center"} alignContent={"center"} w={`${weightChat}px`} h={`${heightChat}px`} bg={"whiteAlpha.700"}>
                <Text fontSize={"2xl"}>No se puede mostrar el chat en videos  
                </Text>
              </Container>
            </>
              : ""}
            {streamerName ?
              <>
                <iframe
                  src={`https://player.twitch.tv/?channel=${streamerName}&parent=${parent}`}
                  height={`${heighStream}px`}
                  width={`${weightStream}px`}
                  allowFullScreen
                >
                </iframe>
                <iframe src={`https://www.twitch.tv/embed/${streamerName}/chat?parent=${parent}`}
                  height={`${heighStream}px`}
                  width={`${weightChat}px`}>
                </iframe>
              </> : ""}
          </Center >
        </Container >
      </Center>
    </>
  )
}

export default App
