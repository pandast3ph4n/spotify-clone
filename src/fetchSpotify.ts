export async function spotifyClient() {
    let token: {
        "access_token": string,
        "token_type": string,
        "expires_in": number
    };
    const savedToken = localStorage.getItem("token")
    if(savedToken) {
        const parsedToken = JSON.parse(savedToken) as typeof token
        if ( parsedToken["expires_in"] < Date.now() / 1000) {

            token = parsedToken
        }
        else {
            token = await fetchToken()
        }
    }
    else {
        token = await fetchToken()
        localStorage.setItem("token", JSON.stringify(token))
    }

    async function getAlbumsByArtist(artistId: string) {
        const url = `https://api.spotify.com/v1/artists/${artistId}/albums?offset=0&limit=50&market=NO&include_groups=single`
        const albumsResponse = await fetch(url, {
            method:"GET",
            headers: {
                Authorization: `Bearer ${token.access_token}`
            }
        })

        return await albumsResponse.json()
    }

    async function getArtists(query: string) {
        const url = `https://api.spotify.com/v1/search?query=${query}&type=artist&market=NO&offset=0&limit=20`
        const artistsResponse = await fetch(url, {
            method:"GET",
            headers: {
                Authorization: `Bearer ${token.access_token}`
            }
        })

        return await artistsResponse.json()
    }

    return {
        getAlbumsByArtist,
        getArtists,
    }
}
async function fetchToken() {
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token?grant_type=client_credentials&client_id=710dbe31ebd44ce890ee6ed9ede0513e&client_secret=f77065a025da45a387db1736de9fd562", {
        method: "POST", 
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
    })
    if(!tokenResponse.ok) {
        console.error(tokenResponse.statusText)
        throw new Error(tokenResponse.statusText)
    }
    return await tokenResponse.json()
    
}