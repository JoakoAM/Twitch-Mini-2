import { Button, ButtonGroup, Card, Center, Container, IconButton, Input, Pagination, Presence, Skeleton, Stack, Text, useMediaQuery } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import './App.css'
import Imagen from './components/Imagen'
interface FormValues {
  streamer_Name: string
  streamer_Video: string
}

const glass = {
  bg: "linear-gradient(135deg,  rgba(255,255,255,0.08),  rgba(255,255,255,0.02))",
  border: "1px solid rgba(255,255,255,0.18)",
  shadow: "0 8px 32px rgba(0,0,0,0.35)",
  blur: "blur(18px)",
}

const glassText = {
  primary: "rgba(255,255,255,0.92)",
  secondary: "rgba(255,255,255,0.65)",
  hint: "rgba(255,255,255,0.45)",
}


interface Stream {
  id: string
  title: string
  user_name: string
  thumbnail_url: string
}

const pageSize = 3
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
  const [recentVideos, setRecentVideos] = useState<Stream[]>([]);
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [cardColors, setCardColors] = useState<Record<string, { r: number; g: number; b: number }>>({});
  const extractColorFromUrl = (url: string, id: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = 32;
      canvas.height = 32;

      ctx?.drawImage(img, 0, 0, 32, 32);

      const data = ctx?.getImageData(0, 0, 32, 32).data;
      if (!data) return;

      let r = 0, g = 0, b = 0;
      const pixels = data.length / 4;

      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }

      r = Math.round(r / pixels);
      g = Math.round(g / pixels);
      b = Math.round(b / pixels);

      setCardColors(prev => ({ ...prev, [id]: { r, g, b } }));
    };
  };
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
        if (data.latestStreams) {
          setRecentVideos(data.latestStreams);
        } else {
          setRecentVideos([]);
        }
      })
      .catch(() => setOfflineImage(""));
  }, [streamerVideo]);
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
        if (data.latestStreams) {
          setRecentVideos(data.latestStreams);
        } else {
          setRecentVideos([]);
        }
      })
      .catch(() => setOfflineImage(""));
  }, [streamerName]);
  useEffect(() => {
    recentVideos.forEach(video => {
      if (cardColors[video.id]) return;

      const thumb = video.thumbnail_url
        .replace("%{width}", "320")
        .replace("%{height}", "180");

      extractColorFromUrl(thumb, video.id);
    });
  }, [recentVideos]);
  const {
    register,
    handleSubmit,
  } = useForm<FormValues>()
  const onSubmitStreamer = handleSubmit((data) => {
    setShowSkeleton(true)
    setStreamerName(data.streamer_Name)
    setStreamerVideo("")
  })
  const onSubmitVideo = handleSubmit((data) => {
    setShowSkeleton(true)
    setStreamerVideo(data.streamer_Video)
    setStreamerName("")
  })

  const [page, setPage] = useState(1)
  console.log(recentVideos);
  const startRange = (page - 1) * pageSize
  const endRange = startRange + pageSize
  const visibleItems = recentVideos.slice(startRange, endRange);

  return (

    <>
    

      <Container
        position="fixed"
        w="100%"
        h="100vh"
        backgroundImage={offlineImage ? `url(${offlineImage})` : "#000"}
        backgroundSize="cover"
        backgroundPosition="center"
        filter="blur(12px) saturate(120%)"
        transform="scale(1.8)"
        animation="bgMove 25s ease-in-out infinite alternate"
      />

      <Center>
        <Container display={"flex"} centerContent w={"100%"}>
          <Container top={"20px"} h={"200px"} alignItems={"center"} display={`${isLandscape && isSmallScreen ? "flex" : "block"}`} rounded={"2xl"} lgDown={{ top: `${isLandscape && isSmallScreen ? "20px" : "40px"}`, h: "300px" }}
            bg={glass.bg}
            backdropFilter={`${glass.blur} saturate(140%)`}
            borderRadius="2xl"
            border={glass.border}
            boxShadow={glass.shadow}
            transition="0.4s ease-in-out"
           
            _before={{
              transition: "2s ease-in-out",
              content: '""',
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(120deg, rgba(255,255,255,0.25), rgba(255,255,255,0.05))",
              opacity: 0.2,
              borderRadius: "inherit",
              pointerEvents: "none",
            }}
          >
            <Container top={`${isLandscape && isSmallScreen ? "0px" : "10px"}`} display={`${isLandscape && isSmallScreen ? "grid" : "block"}`} justifyItems={"center"} lg={{}}>
              <Text textAlign={"justify"} fontWeight={"bold"} color={glassText.primary}
                textShadow="0 1px 2px rgba(0,0,0,0.25)">¿Quieres cambiar de streamer?</Text>
              <form style={{ justifyItems: "center", display: `${isLandscape && isSmallScreen ? "grid" : "block"}` }} onSubmit={onSubmitStreamer}>
                <Input {...register("streamer_Name")}
                  bg="rgba(255,255,255,0.08)"
                  border="1px solid rgba(255,255,255,0.25)"
                  color="white"
                  _placeholder={{ color: glassText.hint }}
                  _focus={{
                    bg: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.45)",
                  }} lgDown={{ w: "250px" }} lg={{ w: "200px" }} {...register("streamer_Name")} />
                <Button type="submit"
                  bg="rgba(255,255,255,0.1)"
                  color="white"
                  border="1px solid rgba(255,255,255,0.25)"
                  backdropFilter="blur(10px)"
                  _hover={{
                    bg: "rgba(255,255,255,0.18)",
                    transform: "translateY(-1px)",
                  }}
                  _active={{
                    bg: "rgba(255,255,255,0.22)",
                  }} w={{ lgDown: "250px", lg: "200px" }} lg={{ ml: "30px" }} >Cambiar streamer</Button >
              </form>
            </Container>
            <Container lgTo2xl={{ top: "20px" }} top={"20px"} lgDown={{ top: `${isLandscape && isSmallScreen ? "" : "20px"}` }} bottom={"24px"} display={`${isLandscape && isSmallScreen ? "grid" : "block"}`} justifyItems={"center"} lg={{}}>
              <Text textAlign={"justify"} fontWeight={"bold"} color={glassText.primary}
                textShadow="0 1px 2px rgba(0,0,0,0.25)">¿Quieres ver un video?. Para eso necesitas el ID, copia el ID del video de Twitch desde el enlace.</Text>
              <Text textAlign={"justify"} fontWeight={"bold"} color={glassText.primary}
                textShadow="0 1px 2px rgba(0,0,0,0.25)">EJ: https://www.twitch.tv/videos/2576132664. El id es :2576132664</Text>
              <form style={{ justifyItems: "center", display: `${isLandscape && isSmallScreen ? "grid" : "block"}` }} onSubmit={onSubmitVideo}>
                <Input {...register("streamer_Name")}
                  bg="rgba(255,255,255,0.08)"
                  border="1px solid rgba(255,255,255,0.25)"
                  color="white"
                  _placeholder={{ color: glassText.hint }}
                  _focus={{
                    bg: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.45)",
                  }} lgDown={{ w: "250px" }} lg={{ w: "200px" }} {...register("streamer_Video")} />
                <Button type="submit"
                  bg="rgba(255,255,255,0.1)"
                  color="white"
                  border="1px solid rgba(255,255,255,0.25)"
                  backdropFilter="blur(10px)"
                  _hover={{
                    bg: "rgba(255,255,255,0.18)",
                    transform: "translateY(-1px)",
                  }}
                  _active={{
                    bg: "rgba(255,255,255,0.22)",
                  }} w={{ lgDown: "250px", lg: "200px" }} lg={{ ml: "30px" }}>Ver video</Button >
              </form>
            </Container>
          </Container>
          <Center h={"calc(100vh - 20px)"} w={"100%"}>
            {streamerVideo ? <>
              <Container lg={{ left: "140px" }}>
                {showSkeleton && <Skeleton height={heighStream} borderTopRightRadius={"0px"} borderBottomRightRadius={"0px"} width={weightStream} />}
                <iframe
                  src={`https://player.twitch.tv/?video=${streamerVideo}&parent=${parent}`}
                  height={`${heighStream}px`}
                  width={`${weightStream}px`}
                  allowFullScreen
                  style={{
                    display: `${showSkeleton ? "none" : "block"}`, borderRadius: "12px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px", boxShadow: "0 10px 40px rgba(0,0,0,0.35)"
                    , animation: "playerIn .5s cubic-bezier(.2,.8,.2,1)"
                  }}
                  onLoad={() => setShowSkeleton(false)}
                >
                </iframe>
              </Container>
              <Container lg={{
                right: "230px", justifyContent: "center", alignContent: "center", w: `${weightChat}px`, h: `${heightChat}px`, bg: "rgb(155 153 153 / 53%)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
                border: "1px solid rgba(255,255,255,0.08)",
                rounded: "2xl",
                borderBottomLeftRadius: "0px",
                borderTopLeftRadius: "0px"
              }}>
                <Text fontWeight={"bold"} fontSize={"2xl"}>No se puede mostrar el chat en videos
                </Text>
              </Container>
            </>
              : ""}
            {streamerName ?
              <Container lgDown={{ top: `${isLandscape && isSmallScreen ? "100px" : ""}` }} display={"flex"} alignSelf={"center"} justifySelf={"center"} justifyContent={"center"} alignContent={"center"}>
                {showSkeleton && <Skeleton height={heighStream} borderTopRightRadius={"0px"} borderBottomRightRadius={"0px"} width={weightStream} />}
                <iframe
                  src={`https://player.twitch.tv/?channel=${streamerName}&parent=${parent}`}
                  height={`${heighStream}px`}
                  width={`${weightStream}px`}
                  style={{ display: `${showSkeleton ? "none" : "block"}`, borderRadius: "12px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px", boxShadow: "0 10px 40px rgba(0,0,0,0.35)" }}
                  onLoad={() => setShowSkeleton(false)}
                  allowFullScreen
                >
                </iframe>
                {showSkeleton && <Skeleton height={heightChat} borderBottomLeftRadius={"0px"} borderTopLeftRadius={"0px"} width={weightChat} />}
                <Presence present={true} hideBelow={"lg"}>
                  <iframe src={`https://www.twitch.tv/embed/${streamerName}/chat?parent=${parent}`}
                    height={`${heightChat}px`}
                    width={`${weightChat}px`}
                    style={{
                      display: `${showSkeleton ? "none" : "block"}`, borderRadius: "12px", borderBottomLeftRadius: "0px", borderTopLeftRadius: "0px", boxShadow: "0 10px 40px rgba(0,0,0,0.35)"
                    }}
                    onLoad={() => setShowSkeleton(false)}
                    allowFullScreen
                  >
                  </iframe>
                </Presence>
              </Container> : ""}

          </Center >
          <Container alignContent={"center"} h={"40px"} w="auto" mb={"12px"} bg={glass.bg}
            backdropFilter={glass.blur}
            borderRadius="sm"
            border={glass.border}
            boxShadow={glass.shadow}
            transition="0.4s ease-in-out"
            _before={{
              transition: "2s ease-in-out",
              content: '""',
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(120deg, rgba(255,255,255,0.25), rgba(255,255,255,0.05))",
              opacity: 0.2,
              borderRadius: "inherit",
              pointerEvents: "none",
            }}>

            <Text textAlign={"center"} fontWeight={"bold"} color="rgba(255,255,255,0.92)">Videos recientes</Text>
          </Container>
          {recentVideos.length > 0 ? <Stack mb={"20px"}>
            <Center>
              <Pagination.Root asChild count={recentVideos.length}
                pageSize={pageSize}
                page={page}
                onPageChange={(e) => setPage(e.page)}>
                <ButtonGroup rounded={"sm"} bg={glass.bg}
                  backdropFilter={glass.blur}
                  borderRadius="sm"
                  border={glass.border}
                  boxShadow={glass.shadow}
                  transition="0.4s ease-in-out"
                  _before={{
                    transition: "2s ease-in-out",
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(120deg, rgba(255,255,255,0.25), rgba(255,255,255,0.05))",
                    opacity: 0.2,
                    borderRadius: "inherit",
                    pointerEvents: "none",
                  }} variant="ghost" size="sm">
                  <Pagination.PrevTrigger asChild>
                    <IconButton>
                      <LuChevronLeft />
                    </IconButton>
                  </Pagination.PrevTrigger>
                  <Pagination.Items
                    render={(page) => (
                      <IconButton fontWeight={"bold"} variant={{ base: "ghost", _selected: "outline" }}>
                        {page.value}
                      </IconButton>
                    )}
                  />
                  <Pagination.NextTrigger asChild>
                    <IconButton>
                      <LuChevronRight />
                    </IconButton>
                  </Pagination.NextTrigger>
                </ButtonGroup>
              </Pagination.Root>
            </Center>
            <Container display="flex" justifyContent="center" gap="10px">
              {visibleItems.map((video) => {
                const color = cardColors[video.id] || { r: 120, g: 120, b: 120 };
                return (
                  <Card.Root

                    key={video.id}
                    bg={`linear-gradient(
          145deg,
          rgba(${color.r},${color.g},${color.b},0.28),
          rgba(${color.r},${color.g},${color.b},0.08)
        )`}
                    backdropFilter="blur(22px) saturate(140%)"
                    border={`1px solid rgba(${color.r},${color.g},${color.b},0.35)`}
                    boxShadow={`
          0 10px 40px rgba(0,0,0,0.45),
          inset 0 1px 0 rgba(255,255,255,0.15),
          0 0 30px rgba(${color.r},${color.g},${color.b},0.25)
        `}
                    transition="all .45s cubic-bezier(.2,.8,.2,1)"
                    _hover={{
                      transform: "translateY(-4px)",
                      boxShadow: "0 14px 40px rgba(0,0,0,.45)",
                      borderColor: "rgba(255,255,255,0.12)"
                    }}
                    onClick={() => {
                      setStreamerVideo(video.id);
                      setStreamerName("");
                    }}
                    animation="cardIn 3s cubic-bezier(.2,.8,.2,1)"
                    cursor="pointer"
                    maxW="sm"
                    overflow="hidden"
                  >
                    <Card.Body gap="2" style={{
                      transform: "translateZ(40px)",
                      transformStyle: "preserve-3d",
                    }}>
                      <Imagen
                        url={video.thumbnail_url
                          .replace("%{width}", "320")
                          .replace("%{height}", "180")}
                      />

                      <Card.Description color="whiteAlpha.900" fontSize="sm">
                        <Text textAlign="justify" fontWeight="bold">
                          {video.title}
                        </Text>
                      </Card.Description>
                    </Card.Body>
                  </Card.Root>
                );
              })}
            </Container>
          </Stack>
            : ""}

        </Container >
      </Center >
    </>
  )
}

export default App
