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
      <input type="text" className="text-gray-700 bg-gray-300" name='list' list="names-list" onChange={debouncedResults}/> 
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
<div id="sidebar-mini" className="hs-overlay [--auto-close:lg] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-20 bg-white border-e border-gray-200 lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 ">
  <div className="flex flex-col justify-center items-center gap-y-2 py-4">
    <div className="mb-4">
      <a className="flex-none" href="#">
        <svg className="w-10 h-auto" width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(0.000000, 100.000000) scale(0.018,-0.018)"
            fill="#08184f" stroke="none">
            <path d="M2270 5089 c-839 -96 -1586 -611 -1975 -1362 -138 -266 -221 -532
              -267 -852 -17 -118 -17 -522 0 -640 42 -297 119 -550 241 -800 330 -672 929
              -1163 1651 -1351 205 -53 310 -64 640 -64 255 0 324 3 425 20 583 95 1140 411
              1521 864 315 374 514 826 586 1331 17 118 17 522 0 640 -46 320 -129 586 -267
              852 -393 757 -1139 1268 -1990 1363 -106 12 -458 11 -565 -1z m268 -1329 c607
              -43 1160 -180 1587 -392 196 -98 238 -129 278 -203 30 -56 30 -164 0 -220 -45
              -86 -117 -129 -213 -129 -61 0 -73 4 -190 67 -432 230 -940 355 -1587 389
              -425 23 -851 -16 -1217 -109 -100 -25 -153 -34 -188 -31 -66 7 -135 51 -173
              112 -27 44 -30 58 -30 130 0 71 4 87 28 129 17 29 47 60 73 76 101 65 546 153
              909 180 162 12 555 13 723 1z m99 -899 c467 -64 905 -204 1254 -403 62 -35
              122 -76 134 -93 71 -96 55 -225 -38 -299 -53 -42 -142 -48 -207 -14 -25 14
              -92 50 -150 81 -455 244 -1108 375 -1692 339 -238 -15 -405 -40 -612 -92 -157
              -40 -160 -40 -211 -25 -116 33 -177 169 -126 280 25 56 79 100 148 120 184 54
              395 96 608 119 194 22 689 15 892 -13z m-12 -831 c366 -55 735 -180 994 -338
              108 -65 131 -96 131 -178 0 -84 -59 -152 -141 -161 -38 -4 -55 1 -119 36 -229
              127 -413 201 -630 255 -184 45 -301 63 -518 77 -282 18 -645 -12 -992 -83
              -156 -32 -208 -19 -251 62 -40 74 -18 171 51 222 43 32 434 103 705 127 174
              16 609 6 770 -19z"/>
          </g>
        </svg>
      </a>
    </div>

    <div className="hs-tooltip [--placement:right] inline-block">
      <button type="button" className="hs-tooltip-toggle w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">
        <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap" role="tooltip">
          Home
        </span>
      </button>
    </div>

    <div className="hs-tooltip [--placement:right] inline-block">
      <button type="button" className="hs-tooltip-toggle w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">
        <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <span className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap" role="tooltip">
          Users
        </span>
      </button>
    </div>

    <div className="hs-tooltip [--placement:right] inline-block">
      <button type="button" className="hs-tooltip-toggle w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">
        <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
        <span className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg whitespace-nowrap" role="tooltip">
          Notifications
        </span>
      </button>
    </div>
  </div>
</div>


    <div className="top-0 start-20 bottom-0 z-[50] relative bg-white relative max-w-[95%]">
      <a className='main-title' href=''><h1>Spotify</h1></a> <br />

      <AutoComplete spotifyApi={spotifyApi} onSelectArtist={handleSelectArtist} />
      <br /><br />
      <div className="grid grid-cols-3 gap-4 text-gray-700"> 
        {tiles?.map((data, index) => <div onClick={() => setAlbumId(data.id)}> 
        <Tile key={index} imageUrl={data.images[0].url} name={data.name} onClick=""></Tile></div>)} 
      </div>
    </div>

    <div className="top-90 start-0 bottom-0 z-[70] bg-white fixed text-gray-700 min-w-[1000px]">
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
