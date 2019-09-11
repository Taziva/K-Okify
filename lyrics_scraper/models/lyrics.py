import requests
from bs4 import BeautifulSoup
import time

from models.current_track import CurrentTrack
from lib.genius import request_song_info

defaults = {
    'message': {
        'search_fail': 'The lyrics for this song were not found!',
        'wrong_input': 'Wrong number of arguments.\n' \
                       'Use two parameters to perform a custom search ' \
                       'or none to get the song currently playing on Spotify.'
    }
}

class Lyrics(object):
    def __init__(self, client):
        self.client = client
        self.current_track = CurrentTrack()

    def list(self):
        self.song_title = self.current_track.song_title()
        self.artist_name = self.current_track.artist()
        
        content = self.load()
        
        self.client.updateLyrics(content)
        while True:
            try:
                if self.song_title == self.current_track.song_title() and self.artist_name == self.current_track.artist():
                    time.sleep(3)
                else:
                    self.song_title = self.current_track.song_title()
                    self.artist_name = self.current_track.artist()
                    content = self.load()
                    self.client.updateLyrics(content)

            except KeyboardInterrupt:
                exit()
        
    def load(self):
        details = '{} by {}'.format(self.song_title, self.artist_name)

        try:
            if self.song_title and self.artist_name is not None:
                self.client.updateStatus({'message':"Searching for Song"})

                response = request_song_info(self.song_title, self.artist_name)
                json = response.json()
                remote_song_info = self.get_song_info(json['response']['hits'])
                self.client.updateStatus({'message':"Song Found"})

                # Extract lyrics from URL if song was found
                if remote_song_info:
                    self.client.updateStatus({'message':"Extracting Lyrics"})
                    song_url = remote_song_info['result']['url']
                    lyrics = self.scrap_song_url(song_url)
                    self.client.updateStatus({'message':"Lyrics Extracted"})

                    return {'details':details, 'lyrics': lyrics, 'artwork': self.current_track.artwork()}
                else:
                    self.client.handle_error("Lyrics can not be found")

            return {'details':details, 'lyrics': defaults['message']['search_fail'], 'artwork': self.current_track.artwork()}
        except Exception as e:
            self.client.handle_error(str(e))

    def sanitize_artist(self, artist):
        return self.artist_name.replace('&', 'and')

    def scrap_song_url(self, url):
        page = requests.get(url)
        html = BeautifulSoup(page.text, 'html.parser')
        [h.extract() for h in html('script')]
        lyrics_container = html.find('div', class_='lyrics')
        if lyrics_container:
            lyrics = html.find('div', class_='lyrics').get_text()

            return lyrics
        else:
            return defaults['message']['search_fail']

    def get_song_info(self, hits):
        for hit in hits:
            art_arr = self.artist_name.lower().split(' ')

            hit_arr = hit['result']['primary_artist']['name'].lower().split(' ')
            if all(x in art_arr for x in hit_arr):
                return hit
            elif self.artist_name.lower() in hit['result']['primary_artist']['name'].lower():
                return hit
            elif all(x in self.sanitize_artist(self.artist_name.lower()) for x in hit_arr):
                return hit
            else:
                continue
