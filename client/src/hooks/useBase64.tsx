import { useState } from 'react';

const useBase64 = () => {
    const [base64, setBase64] = useState<string | null>(null);
    const [base64Sep, setBase64Sep] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);

    // base64 is globally used for the client side code
    // base64Sep is used for python only
    
    const processImageToBase64 = (image: File) => {
        const reader = new FileReader();
        
        reader.onload = () => {
            const base64String = reader.result as string;
            const base64StringSep = base64String.replace("data:", "").replace(/^.+,/, "");
            setBase64(base64String);
            setBase64Sep(base64StringSep);
        };

        reader.onerror = (error) => {
            setError(new Error("Failed to convert image to Base64."));
            console.error("FileReader error:", error);
        };

        reader.readAsDataURL(image);
    };

    const reset = () =>{
        setBase64(null)
        setBase64Sep(null)
        setError(null)
    }

    return { base64, base64Sep, error, processImageToBase64, reset };
};

export default useBase64
