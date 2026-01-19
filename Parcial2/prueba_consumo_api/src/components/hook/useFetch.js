import { useState, useEffect } from "react";

export function useFetch(asyncFunction) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await asyncFunction();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [asyncFunction]);
    
    return { data, loading, error };
}
