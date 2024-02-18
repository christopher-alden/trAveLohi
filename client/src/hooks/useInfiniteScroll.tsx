import { useEffect, useRef, useState } from "react";

const useInfiniteScroll = () => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [enableFetch, setEnableFetch] = useState(true);
    const scrollEndRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                setIsIntersecting(target.isIntersecting);
            }
        );

        if (scrollEndRef.current) {
            observer.observe(scrollEndRef.current);
        }

        return () => {
            if (scrollEndRef.current) {
                observer.unobserve(scrollEndRef.current);
            }
        };
    }, []);

    return { scrollEndRef, isIntersecting, enableFetch, setEnableFetch };
};


export default useInfiniteScroll