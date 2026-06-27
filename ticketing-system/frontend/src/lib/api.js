export default async function fetchApi(path, options = {}) {

    const response = await fetch(import.meta.env.VITE_API_BASE_URL + path,
        {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            ...options
        }
    )

    const data = await response.json();

    return {
        status: response.status,
        ...data
    };
}

