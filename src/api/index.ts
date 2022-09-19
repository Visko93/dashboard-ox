export { }


type Client = {
    url: string;
    query?: string
}


const apiClient = <T>({ url, query }: Client) => {
    return new Promise<T>(async (res, rej) => {
        try {
            const data = typeof query === 'undefined' ? await fetch(url) : await fetch(`${url}?${query}`)
            if (data.ok) {
                res(data.json())
            }
        } catch (error) {
            throw new Error(`${error}`)
        }
    })
}

export { apiClient }