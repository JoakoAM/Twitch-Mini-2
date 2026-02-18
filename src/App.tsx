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
  const parent= "https://joakoam.github.io"
  const [streamerName, setStreamerName] = useState("twitch")
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
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        filter="blur(8px)"
        transform="scale(2.05)">
      </Container>

      <Center>
        <Container>
          <Container zIndex={"9999"} position={"absolute"} pt={"40px"} w={"500px"}>
            <Text color={'white'}>Quieres cambiar de streamer?</Text>
            <form onSubmit={onSubmitStreamer}>
              <Input bg={'whiteAlpha.700'} w={"200px"} {...register("streamer_Name")} />
              <Button type="submit" ml={"30px"}>Cambiar streamer</Button >
            </form>
          </Container>
          <Container position={"absolute"} pt={"40px"} pl={"500px"}>
            <Text color={'white'}>Quieres ver un video?, para ellos necesitas el ID.</Text>
            <form onSubmit={onSubmitVideo}>
              <Input bg={'whiteAlpha.700'} w={"200px"} {...register("streamer_Video")} />
              <Button type="submit" ml={"30px"}>Ver video</Button >
            </form>
          </Container>
          <Center h={"100vh"} w={"100%"}>
            {streamerVideo ? <>
              <iframe
                src={`https://player.twitch.tv/?video=${streamerVideo}&parent=${parent}`}
                height="720"
                width="1080"
                allowFullScreen
              >
              </iframe>
              <Container justifyContent={"center"} centerContent w={"300px"} h={"720px"} bg={"whiteAlpha.700"} right={"0"}>
                <Text fontSize={"2xl"}>No se puede mostrar el chat en el video

                </Text>
                <PiMaskSadBold size={"50px"} />
              </Container>

            </>
              : ""}
            {streamerName ?
              <>
                <iframe
                  src={`https://player.twitch.tv/?channel=${streamerName}&parent=${parent}`}
                  height="720"
                  width="1080"
                  allowFullScreen
                >
                </iframe>
                <iframe src={`https://www.twitch.tv/embed/${streamerName}/chat?parent=${parent}`}
                  height="720"
                  width="300">
                </iframe>
              </> : ""}
          </Center >
        </Container >
      </Center>
    </>
  )
}

export default App
