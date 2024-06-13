import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { spotifyClient } from './fetchSpotify'
import debounce from 'lodash.debounce'
import SpotifyPlayer from 'react-spotify-web-playback';

const spotify_sdk_token = import.meta.env.VITE_SDK_TOKEN;


function Tile({imageUrl, name}: {imageUrl:string, name: string}) {

  return (
    <>
      <div className="tile">
        <img src={imageUrl} ></img>
        <p>{name}</p>
      </div> 
    </>
  )
}

function AutoComplete({ spotifyApi, onSelectArtist }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [artists, setArtists] = useState([])
  const ref = useRef(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    spotifyApi?.getArtists(searchTerm).then(({artists: {items = []}}) => {
      setArtists(items)
    })
  }, [searchTerm])
  
  useEffect(() => {
    const selectedArtist = artists.find(artist => artist.name === searchTerm);
    if (selectedArtist) {
      onSelectArtist(selectedArtist.name, selectedArtist.id);
    }
  }, [artists])

  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 300);
  }, []);

  

  return (
    <>
      <input type="text" name='list' list="names-list" onChange={debouncedResults}/> 
      <datalist ref={ref} id="names-list">
        {artists?.map((artist) => (
          <option key={artist.id} value={artist.name}></option>
        ))}
      </datalist>
 
    </>
  );
}
 

function App() {
  const [tiles, setTiles] = useState([]);
  const [spotifyApi, setSpotifyApi] = useState<Awaited<ReturnType<typeof spotifyClient>>>()
  const [albumId, setAlbumId] = useState( "" );
  const [selectedArtist, setSelectedArtist] = useState({ name: "", id: "" });
  const [tracks, setTracks] = useState([]);


  useMemo( async () => {
    const client = await spotifyClient();
    setSpotifyApi(client);
  }, [])

  useEffect(() => {
    spotifyApi?.getAlbumsByArtist(selectedArtist.id).then(({items}) => setTiles(items))

  }, [selectedArtist])

  useEffect (() => {
    spotifyApi?.getTracks(albumId).then(tracks => setTracks(tracks.items))
  
  }, [albumId])

  const handleSelectArtist = (name, id) => {
    setSelectedArtist({ name, id });
  };

  return (
    <>
    <div className="sidebar">
      <div>Home</div>
      <div>Playlists</div>
      <div>Liked Songs</div>
    </div>

    <div className="main">
      <a className='main-title' href=''><h1>Spotify</h1></a> <br />

      <AutoComplete spotifyApi={spotifyApi} onSelectArtist={handleSelectArtist} />
      <br /><br />
      <div className="grid grid-cols-3 gap-4"> 
        {tiles?.map((data, index) => <div onClick={() => setAlbumId(data.id)}> 
        <Tile key={index} imageUrl={data.images[0].url} name={data.name} onClick=""></Tile></div>)} 
      </div>
    </div>

    
    <div className='playbar'>
    <SpotifyPlayer
  token={spotify_sdk_token}
  uris={tracks?.map(item => item.uri)}
  play={true}
/>
      
    </div>
    </>
  )
}

export default App
