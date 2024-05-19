class MusicPlayer {
    constructor() {
        this.initializePlayer();
        this.loadSongs();
    }

    initializePlayer() {
        this.songs = [];
        this.currentSongIndex = 0;
        this.audio = new Audio();
        this.setInitialVolume();
        this.initializeVolumeControls();
        this.initializePlayPauseButton();
    }

    setInitialVolume() {
        this.audio.volume = 0.5;
        this.previousVolume = this.audio.volume;
    }

    initializeVolumeControls() {
        this.volumeSlider = document.querySelector('.volume-slider');
        this.volumePercentage = document.querySelector('.volume-percentage');
        this.volumeSlider.addEventListener('input', () => this.updateVolume());
    }

    initializePlayPauseButton() {
        this.playPauseButton = document.querySelector('#play-pause-btn i');
    }

    loadSongs() {
        fetch('data/songs.json')
            .then(response => response.json())
            .then(data => {
                this.songs = data;
                this.loadSong();
            });
    }

    loadSong() {
        const song = this.getCurrentSong();
        this.setSongDetails(song);
        this.audio.src = song.path;
        this.updatePlayPauseIcon();
    }

    getCurrentSong() {
        return this.songs[this.currentSongIndex];
    }

    setSongDetails(song) {
        document.querySelector('.song-image img').src = song.img;
        document.querySelector('.song-title').textContent = song.name;
        document.querySelector('.song-artist').textContent = song.artist;
    }

    togglePlayPause() {
        if (this.audio.paused) {
            this.audio.play();
        } else {
            this.audio.pause();
        }
        this.updatePlayPauseIcon();
    }

    nextSong() {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
        this.loadSong();
    }

    prevSong() {
        this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
        this.loadSong();
    }

    updateVolume() {
        this.audio.volume = this.volumeSlider.value / 100;
        this.volumePercentage.textContent = `${this.volumeSlider.value}%`;
    }

    toggleMute() {
        if (this.audio.volume > 0) {
            this.muteAudio();
        } else {
            this.unmuteAudio();
        }
    }

    muteAudio() {
        this.previousVolume = this.audio.volume;
        this.audio.volume = 0;
        this.updateVolumeControls(0);
    }

    unmuteAudio() {
        this.audio.volume = this.previousVolume;
        this.updateVolumeControls(this.previousVolume * 100);
    }

    updateVolumeControls(value) {
        this.volumeSlider.value = value;
        this.volumePercentage.textContent = `${value}%`;
    }

    updatePlayPauseIcon() {
        this.playPauseButton.textContent = this.audio.paused ? 'play_arrow' : 'pause';
    }
}

window.onload = function () {
    const player = new MusicPlayer();
    initializePlayerControls(player);
};

function initializePlayerControls(player) {
    document.querySelector('.control-btn.play').addEventListener('click', () => player.togglePlayPause());
    document.querySelector('.control-btn.next').addEventListener('click', () => player.nextSong());
    document.querySelector('.control-btn.prev').addEventListener('click', () => player.prevSong());
    document.querySelector('#volume_off').addEventListener('click', () => player.toggleMute());
    document.querySelector('#volume_up').addEventListener('click', () => player.toggleMute());
}