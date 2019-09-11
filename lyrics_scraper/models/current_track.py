from Foundation import NSAppleScript

class CurrentTrack(object):
    def artist(self):
        return self.get_current_song_info()['artist']

    def song_title(self):
        return self.get_current_song_info()['song']
    
    def artwork(self):
        return self.get_current_song_info()['artwork']

    def get_current_song_info(self):
        apple_script_code = """
        getCurrentlyPlayingTrack()
        on getCurrentlyPlayingTrack()
            tell application "Spotify"
                set currentArtist to artist of current track as string
                set currentTrack to name of current track as string
                set art to artwork url of current track as string
                return {currentArtist, currentTrack, art}
            end tell
        end getCurrentlyPlayingTrack
        """
        s = NSAppleScript.alloc().initWithSource_(apple_script_code)
        x = s.executeAndReturnError_(None)
        a = str(x[0]).split('"')
        return {'artist': a[1], 'song':a[3], 'artwork': a[5]}