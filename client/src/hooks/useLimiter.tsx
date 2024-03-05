import { useState } from "react"

// This is used for pagination
// Set the initial limit then use updateOffset as a callback

const useLimiter = () =>{
    const [offset, setOffset] = useState(0)
    const [limit, setLimit] = useState(5)

    const updateOffset = ()=>{
        setOffset(prevOffset => prevOffset + limit)
    }

    return { offset, setOffset, limit, setLimit, updateOffset}
}

export default useLimiter