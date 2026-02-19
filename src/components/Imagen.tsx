import { Skeleton, Image } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';

type Props = {
    url: string;
}

function Imagen({ url }: Props) {
    const fetchImage = async (imageUrl: string) => {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Error al cargar la imagen');
        const blob = await response.blob();
        return URL.createObjectURL(blob); // Crea un URL local de la imagen
    };
    const { data: stringUrl, isLoading } = useQuery({
        queryKey: ['image', url],
        queryFn: () => fetchImage(url),
        staleTime: 1000 * 60 * 5, // La imagen se mantiene en caché 5 minutos
        cacheTime: 1000 * 60 * 10, // La imagen se mantiene en memoria 10 minutos
    });
    console.log(stringUrl);
    if (isLoading) return <Skeleton height="180px" width="320px" />;

    return <Image style={{
        borderRadius: "10px",
        transform: "translateZ(60px)",
    }} rounded={"l2"} src={stringUrl} alt="Thumbnail" width={320} height={180} />;
}

export default Imagen
