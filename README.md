
# Spotify Clone

This app is a new front for Spotify were you search by artist and you get a list of all their album and singles, you click on one of their album or singles and it starts to play it.



## Screenshots

![App Screenshot](https://github.com/pandast3ph4n/spotify-clone/assets/47857602/6174db43-5816-4d40-9f9d-8893a399a734)

![App Screenshot](https://github.com/pandast3ph4n/spotify-clone/assets/47857602/2bccb8b2-6e56-4979-ac59-85f476ef5f26)



## Installation

Install Spotify Clone with npm


Open your terminal and then type

```bash
git clone https://github.com/pandast3ph4n/spotify-clone.git
```

This clones the repo
cd into the new folder 
```bash
cd spotify-clone
```
Next type
```bash
npm install
```

This installs the required dependencies

To run the React project.
```bash
npm run dev
```
## API Reference

#### Spotify API

The first thing you need to do is to make a spotify app that uses both the web API and the web playback SDK. Follow this link
https://developer.spotify.com/documentation/web-api/concepts/apps

You will also need an token for the playback SDK to get this use the link below, remember this token only lasts 1 hour.
https://developer.spotify.com/documentation/web-playback-sdk/tutorials/getting-started

#### .env

After you have made an app and cloned the repo, you will need to create your own .env file that follows this template

```dotenv
VITE_SPOTIFY_CLIENT_ID='client id'
VITE_SPOTIFY_CLIENT_SECRET='client secret'
VITE_SDK_TOKEN="sdk token"
```

After you have put in your own data, the app should be working.