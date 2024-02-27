import { useState } from 'react';
import Container from '@comp/container/Container';
import { ApiEndpoints } from '@util/api.utils';
import ProtectedRoute from 'src/middleware/ProtectedRoute';
import Navbar from '@comp/navigation/Navbar';
import '@styles/generic-styles/container.styles.scss'
import useBase64 from 'src/hooks/useBase64';
import Footer from '@comp/navigation/Footer';

const GeoGuesser = () => {
    const { base64Sep, error, processImageToBase64 } = useBase64();

    const [image, setImage] = useState<File | null>(null);
    const [location, setLocation] = useState<string | null>(null);

    const processImage = async () => {
        if (image) {
            processImageToBase64(image);
            
            if(error){
                console.error(error)
            };

            try {
                const response = await fetch(ApiEndpoints.GeoGuesser, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ image: base64Sep }),
                });

                const data = await response.json();
                if (data.location) {
                    setLocation(data.location);
                } else {
                    throw new Error(data.error || 'Unknown error');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const inputImage = formData.get("image");

        if (inputImage instanceof File) {
            setImage(inputImage);
        }
    };

    return (
        <ProtectedRoute>
            <Container px='0px' py='0px' direction='column' width='100%' className="bg-notthatwhite min-h-full">
                <Navbar/>
                <Container px='0px' py='0px' className='push-navbar '>
                    <Container>
                        <form onSubmit={onSubmit}>
                            <input name="image" type="file" accept="image/*" />
                            <button type="submit">Upload Image</button>
                            {image && <button type="button" onClick={processImage}>Process Image</button>}
                        </form>
                        {location && <p>Predicted Location: {location}</p>}
                    </Container>
                </Container>
            </Container>
            <Footer/>
        </ProtectedRoute>
    );
};

export default GeoGuesser;
