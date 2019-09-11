import re, requests
from constants import TOKEN

defaults = {
    'request': {
        'token': TOKEN,
        'base_url': 'https://api.genius.com'
    },
    'message': {
        'search_fail': 'The lyrics for this song were not found!',
        'wrong_input': 'Wrong number of arguments.\n' \
                       'Use two parameters to perform a custom search ' \
                       'or none to get the song currently playing on Spotify.'
    }
}

def sanitize_song(song):
    song = re.sub(r'\([^)]*\)', '', song).strip()  # remove braces and included text
    song = re.sub('- .*', '', song).strip()
    return song

def request_song_info(song_title, artist_name):
    base_url = defaults['request']['base_url']
    headers = {'Authorization': 'Bearer ' + defaults['request']['token']}
    search_url = base_url + '/search'
    params = {'q': artist_name + ' ' + sanitize_song(song_title)}
    response = requests.get(search_url, params=params, headers=headers)
    return response