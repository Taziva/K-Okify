import sys
import zerorpc
import requests

from models.lyrics import Lyrics

def main():
    client = zerorpc.Client()
    client.connect("tcp://127.0.0.1:4242")
    client.health()
    lyrics = Lyrics(client)
    try:
        lyrics.list()
    except Exception as e:
        client.error(str(e))

if __name__ == '__main__':
    main()
