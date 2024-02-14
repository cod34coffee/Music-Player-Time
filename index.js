// Get references to various elements in the HTML document
var audio = document.getElementById("audio-player"); // Reference to the audio player element
var progressBar = document.querySelector(".progress-indicator"); // Reference to the progress indicator element
var favoriteIcon = document.getElementById("favorite-icon"); // Reference to the favorite icon element
var songPhoto = document.getElementById("song-photo"); // Reference to the song photo element
var songTitle = document.getElementById("song-title"); // Reference to the song title element
var artistName = document.getElementById("artist-name"); // Reference to the artist name element

// Playlist containing song information
// I got the following songs for free from https://pixabay.com/
var playlist = [
    {
        //Music found on https://pixabay.com/music/beats-goldn-116392/
        src: "./Audio/goldn-116392.mp3",
        photo: "./Images/_31bfd26c-1d4c-46fa-928b-d2be4e50516f.jpg",
        title: "Goldn",
        artist: "prazkhanal"
    },
    {
        //Music found on https://pixabay.com/music/future-bass-leonell-cassio-the-blackest-bouquet-118766/
        src: "./Audio/leonell-cassio-the-blackest-bouquet-118766.mp3",
        photo: "./Images/_a3fc3877-82d3-4eb6-a31b-1a16a5c5d416.jpg",
        title: "The Blackest Bouquet",
        artist: "LeonellCassio"
    },
    {
        //Music found on https://pixabay.com/music/beats-once-in-paris-168895/
        src: "./Audio/once-in-paris-168895.mp3",
        photo: "./Images/egghead.jpg",
        title: "Once In Paris",
        artist: "Pumpupthemind"
    }
];

// Index of the currently playing song in the playlist
var currentIndex = 0;

// Reference to the play/pause icon element
var iconElement = document.getElementById("play-pause-icon");

// Function to play or pause the audio
function playPause() {
    // Check if the audio is paused
    if (audio.paused) {
        // If paused, play the audio and change the icon to pause
        audio.play();
        iconElement.setAttribute("name", "pause-circle-outline");
    } else {
        // If playing, pause the audio and change the icon to play
        audio.pause();
        iconElement.setAttribute("name", "play-circle-outline");
    }
}

// Function to skip to the next or previous song in the playlist
function skip(direction) {
    // Calculate the index of the next song based on the direction (forward/backward)
    currentIndex = (currentIndex + (direction === 'forward' ? 1 : -1) + playlist.length) % playlist.length;
    // Play the song from the updated index
    playFromPlaylist(currentIndex);
}

// Function to add or remove the currently playing audio from favorites
function addToFavorites() {
    // Get the favorites from local storage or initialize an empty array
    var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    // Get the URL of the currently playing audio
    var currentAudio = audio.src;

    // Check if the current audio is not in favorites
    if (!favorites.includes(currentAudio)) {
        // If not, add it to favorites, update local storage, and change the favorite icon
        favorites.push(currentAudio);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        favoriteIcon.setAttribute("name", "heart");
        alert('Added To Favorites!');
    } else {
        // If it's already in favorites, remove it, update local storage, and change the favorite icon
        var index = favorites.indexOf(currentAudio);
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        favoriteIcon.setAttribute("name", "heart-outline");
        alert("Okay, that song is gone!");
    }
}

// Function to update the player UI (progress bar, current time, etc.)
function updatePlayer() {
    // Calculate the playback percentage
    var percentage = (audio.currentTime / audio.duration) * 100;
    // Update the progress bar width
    progressBar.style.width = percentage + '%';

    // Format current time and duration
    var currentTime = formatTime(audio.currentTime);
    var duration = formatTime(audio.duration);
    
    // Update displayed current time and duration
    var progressTime = document.querySelector(".time-start");
    var endTime = document.querySelector(".time-end");
    progressTime.textContent = currentTime;
    endTime.textContent = duration;
}

// Function to format time in MM:SS format
function formatTime(time) {
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Function to play a song from the playlist at the specified index
function playFromPlaylist(index) {
    // Check if the index is valid
    if (index >= 0 && index < playlist.length) {
        // Set the audio source, play it, and update the UI
        audio.src = playlist[index].src;
        audio.play();
        updateUI();
    }
}

// Function to update the UI with song information and icon
function updateUI() {
    // Clear the song photo element
    songPhoto.innerHTML = '';
    // Create an image element for the album art
    var img = document.createElement('img');
    img.src = playlist[currentIndex].photo;
    img.alt = 'Album Art';
    img.classList.add("album-art");
    // Append the image to the song photo element
    songPhoto.appendChild(img);
    // Update song title and artist name
    songTitle.textContent = playlist[currentIndex].title;
    artistName.textContent = playlist[currentIndex].artist;
    // Update play/pause icon
    updateIcon();
}

// Function to update the play/pause icon based on audio playback state
function updateIcon() {
    if (audio.paused) {
        iconElement.setAttribute("name", "play-circle-outline");
    } else {
        iconElement.setAttribute("name", "pause-circle-outline");
    }
}

// Start playing the first song in the playlist when the page loads
playFromPlaylist(0);

// Event listener to play the next song when the current one ends
audio.addEventListener('ended', function() {
    currentIndex = (currentIndex + 1) % playlist.length;
    playFromPlaylist(currentIndex);
});
