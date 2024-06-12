import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { spotifyClient } from './fetchSpotify'
import debounce from 'lodash.debounce'



function Tile({imageUrl}: {imageUrl:string}) {
  
  return (
    <>
      <div className="tile">
        <img src={imageUrl} ></img>
        <p>Test</p>
      </div> 
    </>
  )
}

function AutoComplete({ artists, onSelectArtist }) {
  const handleSelect = (e) => {
    const selectedArtist = artists.find(artist => artist.name === e.target.value);
    if (selectedArtist) {
      onSelectArtist(selectedArtist.name, selectedArtist.id);
    }
  };

  return (
    <>
      <datalist id="names-list">
        {artists?.map((artist) => (
          <option key={artist.id} value={artist.name}></option>
        ))}
      </datalist>
      <input type="text" onChange={handleSelect} list="names-list" />
    </>
  );
}


function App() {
  const [tiles, setTiles] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [spotifyApi, setSpotifyApi] = useState<Awaited<ReturnType<typeof spotifyClient>>>()
  const [artists, setArtists] = useState(null)
  const [selectedArtist, setSelectedArtist] = useState({ name: "", id: "" });


  useMemo( async () => {
    const client = await spotifyClient()
    const {items} = await client.getAlbumsByArtist(selectedArtist.id)
    setSpotifyApi(client)
    setTiles(items)
  }, [])

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 300);
  }, []);

  useEffect (() => {
    spotifyApi?.getArtists(searchTerm).then(setArtists)
  },[searchTerm]);

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
      <h1>Spotify</h1>

      <input type="text" onChange={debouncedResults} list="names-list"/>  
  

      <br></br><br></br>

      {selectedArtist.name && <p>Selected Artist: {selectedArtist.name}</p>} {/* Change here */}
      {selectedArtist.id && <p>Selected Artist ID: {selectedArtist.id}</p>} {/* New field */}

      <AutoComplete artists={artists?.artists?.items ?? []} onSelectArtist={handleSelectArtist} />



      <div className="grid grid-cols-3 gap-4">
        {tiles?.map((data, index) => <Tile key={index} imageUrl={data.images[0].url}></Tile>)}
      </div>
    </div>
    
    <div className='playbar'>
    </div>
    </>
  )
}

export default App
