import { Button, Center, Container, Input, Presence, Text, useMediaQuery} from '@chakra-ui/react'
import './App.css'
import { useEffect, useState } from 'react'
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
  const [isLandscape] = useMediaQuery(["(orientation: landscape)",])
  const [isSmallScreen] = useMediaQuery(["(max-width: 768px)"])
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
        transform="scale(2.1)"
      >
      </Container>

      <Center>
        <Container display={"flex"} centerContent w={"100%"}>
          <Container lgTo2xl={{ h: "200px", top: "20px" }} alignItems={"center"} display={`${isLandscape && isSmallScreen ? "flex" : "block"}`} rounded={"2xl"} lgDown={{ top: `${isLandscape && isSmallScreen ? "20px" : "40px"}`, h: "300px" }} bg={"#7371709e"}>
            <Container top={`${isLandscape && isSmallScreen ? "0px" : "10px"}`} display={`${isLandscape && isSmallScreen ? "grid" : "block"}`} justifyItems={"center"} lg={{}}>
              <Text textAlign={"justify"} color={'white'}>¿Quieres cambiar de streamer?</Text>
              <form style={{ justifyItems: "center", display: `${isLandscape && isSmallScreen ? "grid" : "block"}` }} onSubmit={onSubmitStreamer}>
                <Input lgDown={{ w: "250px" }} bg={'whiteAlpha.400'} lg={{ w: "200px" }} {...register("streamer_Name")} />
                <Button type="submit" w={{ lgDown: "250px", lg: "200px" }} lg={{ ml: "30px" }} >Cambiar streamer</Button >
              </form>
            </Container>
            <Container lgTo2xl={{ top: "20px" }} lgDown={{ top: `${isLandscape && isSmallScreen ? "" : "20px"}` }} bottom={"24px"} display={`${isLandscape && isSmallScreen ? "grid" : "block"}`} justifyItems={"center"} lg={{}}>
              <Text textAlign={"justify"} color={'white'}>¿Quieres ver un video?, para eso necesitas el ID. Copia el ID del video de Twitch desde el enlace.</Text>
              <Text textAlign={"justify"} color={'white'}>EJ: https://www.twitch.tv/videos/2576132664. El id es :2576132664</Text>
              <form style={{ justifyItems: "center", display: `${isLandscape && isSmallScreen ? "grid" : "block"}` }} onSubmit={onSubmitVideo}>
                <Input lgDown={{ w: "250px" }} bg={'whiteAlpha.400'} lg={{ w: "200px" }} {...register("streamer_Video")} />
                <Button type="submit" w={{ lgDown: "250px", lg: "200px" }} lg={{ ml: "30px" }}>Ver video</Button >
              </form>
            </Container>
          </Container>
          <Center h={"calc(100vh - 20px)"} w={"100%"}>
            {streamerVideo ? <>
              <Container lg={{ left: "140px" }}>
                <iframe
                  src={`https://player.twitch.tv/?video=${streamerVideo}&parent=${parent}`}
                  height={`${heighStream}px`}
                  width={`${weightStream}px`}
                  allowFullScreen
                >
                </iframe>
              </Container>
              <Container lg={{ right: "230px", justifyContent: "center", alignContent: "center", w: `${weightChat}px`, h: `${heightChat}px`, bg: "whiteAlpha.700" }}>
                <Text fontSize={"2xl"}>No se puede mostrar el chat en videos
                </Text>
              </Container>
            </>
              : ""}
            {streamerName ?
              <Container lgDown={{ top: `${isLandscape && isSmallScreen ? "100px" : ""}` }} display={"flex"} alignSelf={"center"} justifySelf={"center"} justifyContent={"center"} alignContent={"center"}>
                <iframe
                  src={`https://player.twitch.tv/?channel=${streamerName}&parent=${parent}`}
                  height={`${heighStream}px`}
                  width={`${weightStream}px`}
                  allowFullScreen
                >
                </iframe>
                <Presence present={true} hideBelow={"lg"}>

                  <iframe src={`https://www.twitch.tv/embed/${streamerName}/chat?parent=${parent}`}
                    height={`${heightChat}px`}
                    width={`${weightChat}px`}>
                  </iframe>
                </Presence>
              </Container> : ""}
          </Center >
        </Container >
      </Center>
    </>
  )
}

export default App
