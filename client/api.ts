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

    }

    likeFrame = async (frameId: number) => {

    }

}

export default new Api()