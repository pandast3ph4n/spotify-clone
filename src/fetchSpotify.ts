

const spotify_client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const spotify_client_secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;


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
        const url = `https://api.spotify.com/v1/artists/${artistId}/albums?offset=0&limit=50&market=NO&include_groups=single,album`
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

    async function getTracks(albumId: string) {
        const url = `https://api.spotify.com/v1/albums/${albumId}/tracks`
        const albumIdResponse = await fetch(url, {
            method:"GET",
            headers: {
                Authorization: `Bearer ${token.access_token}`
            }
        })

        return await albumIdResponse.json()
    }

    return {
        getAlbumsByArtist,
        getArtists,
        getTracks,
        token
    }
}
async function fetchToken() {
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token?grant_type=client_credentials&client_id="+spotify_client_id+"&client_secret="+spotify_client_secret, {
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