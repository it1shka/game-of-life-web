export interface Frame {
    id: number,
    name: string
    frame: string,
    likes: number
}

class Api {

    putFrame = async (name: string, frame: string) => {
        const result = await fetch('/api/new', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name, frame
            })
        })
        return result.ok
    }

    getFrames = async (offset: number) => {
        const queryParams = new URLSearchParams({
            offset: String(offset),
        }).toString()

        const result = await fetch(`/api/frames?${queryParams}`, {
            method: 'GET',
        })

        if (!result.ok) {
            console.log('Failed to load frames')
            return []
        }
        return await result.json() as Frame[]
    }

    likeFrame = async (frameId: number) => {
        const result = await fetch(`/api/like/${frameId}`)
        return result.ok
    }

}

export default new Api()