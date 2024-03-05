import { useEffect, useState } from 'react';
import Container from '@comp/container/Container';
import { ApiEndpoints } from '@util/api.utils';
import ProtectedRoute from 'src/middleware/ProtectedRoute';
import Navbar from '@comp/navigation/Navbar';
import '@styles/generic-styles/container.styles.scss'
import useBase64 from 'src/hooks/useBase64';
import Footer from '@comp/navigation/Footer';
import { useSearch } from 'src/context/searchContext';

const GeoGuesser = () => {
    const { base64Sep , error, processImageToBase64 } = useBase64();
    const { execSearch, setSearchTerm, searchMode, setSearchMode ,searchResults} = useSearch();

    const [image, setImage] = useState<File | null>(null);
    const [location, setLocation] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const processImage = async () => {
        if (image) {
            setIsProcessing(true);
            await processImageToBase64(image);
        }
    };

    const handleLocationSearch = async () => {
        if (location) {
            setSearchTerm(location);
            setSearchMode('flights'); 
            let searchQuery =''
            searchQuery = `/explore/flights/?searchMode=${encodeURIComponent('flights')}&searchType=${encodeURIComponent('location')}`
            searchQuery = searchQuery + `&departureId=${encodeURIComponent(searchResults[0].ID)}&arrivalId=${encodeURIComponent(searchResults[0].ID)}`
            execSearch(searchQuery);
        }
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const inputImage = formData.get("image");

        if (inputImage instanceof File) {
            setImage(inputImage);
        }
    };

    // React useEffect hook to trigger the API call once the base64 encoding is done
    useEffect(() => {
        const fetchLocation = async () => {
            if (base64Sep && isProcessing) {
                try {
                    const response = await fetch(ApiEndpoints.GeoGuesser, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ image: base64Sep }),
                    });

                    const data = await response.json();
                    setLocation(data.location);
                    setIsProcessing(false);
                } catch (error) {
                    console.error('Error:', error);
                    setIsProcessing(false);
                }
            }
        };

        fetchLocation();
    }, [base64Sep, isProcessing]);


    return (
        <ProtectedRoute>
            <Container px='0px' py='0px' direction='column' width='100%' className="bg-notthatwhite min-h-full">
                <Navbar/>
                <Container px='0px' py='0px' className='push-navbar '>
                    <Container>
                        <form onSubmit={onSubmit}>
                            <input name="image" type="file" accept="image/*" />
                            <button type="submit">Upload Image</button>
                            {image && !isProcessing && <button type="button" onClick={processImage}>Process Image</button>}
                        </form>
                        {location && 
                        <>
                        <p>Predicted Location: {location}</p>
                        <button onClick={handleLocationSearch}>Search for Hotels Here</button>
                        </>}
                        
                    </Container>
                </Container>
            </Container>
            <Footer/>
        </ProtectedRoute>
    );
};

export default GeoGuesser;
