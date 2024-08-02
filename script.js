console.log("Welcome to Groovehub");

// Initialize the Variables
let songIndex = 0;
let audioElement = new Audio();
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let volumeControl = document.getElementById('volumeControl');
let songItems = Array.from(document.getElementsByClassName('songItem'));
let vizImage = document.getElementById('viz');
let isPlaying = false;

// Hide the visualizer image initially
vizImage.style.opacity = '0'; // Initially set opacity to 0

// Array of songs with their details
let songs = [
    { songName: "Starboy", filePath: "The Weeknd - Starboy (Audio) ft. Daft Punk (64).mp3", coverPath: "covers/1.jpg" },
    { songName: "Stargazing", filePath: "Travis Scott - STARGAZING (Audio).mp3", coverPath: "pic2.png" },
    { songName: "Tauba Tauba", filePath: "Tauba Tauba _ Bad Newz _ Vicky Kaushal _ Triptii Dimri _ Karan Aujla _ In cinemas 19th July.mp3", coverPath: "covers/4.jpg" },
];

// Function to load the song
function loadSong(index) {
    audioElement.src = songs[index].filePath;
    audioElement.load();
}

// Load the first song initially
loadSong(songIndex);

// Display songs in the song list
songItems.forEach((element, i) => {
    element.getElementsByTagName("img")[0].src = songs[i].coverPath;
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
});

// Handle play/pause click
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        isPlaying = true;
        vizImage.style.opacity = '1'; // Show visualizer image smoothly
    } else {
        audioElement.pause();
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
        isPlaying = false;
        vizImage.style.opacity = '0'; // Hide visualizer image smoothly
    }
});

// Update seekbar as audio plays
audioElement.addEventListener('timeupdate', () => {
    let progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    myProgressBar.value = progress;
});

// Update audio current time based on seekbar change
myProgressBar.addEventListener('change', () => {
    audioElement.currentTime = myProgressBar.value * audioElement.duration / 100;
});

// Control volume based on volume slider
volumeControl.addEventListener('input', () => {
    audioElement.volume = volumeControl.value / 100;
});

// Play a song when clicked from the song list
songItems.forEach((element, i) => {
    element.addEventListener('click', () => {
        songIndex = i;
        loadSong(songIndex);
        audioElement.currentTime = 0;
        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        isPlaying = true;
        vizImage.style.opacity = '1'; // Show visualizer image smoothly
    });
});

// Function to play the next song
function nextSong() {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songIndex);
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
    vizImage.style.opacity = '1'; // Show visualizer image smoothly
}

// Function to play the previous song
function previousSong() {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songIndex);
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
    vizImage.style.opacity = '1'; // Show visualizer image smoothly
}

// Event listener for the forward button
document.querySelector('.fa-forward').addEventListener('click', nextSong);

// Event listener for the backward button
document.querySelector('.fa-backward').addEventListener('click', previousSong);

// Automatically play the next song when the current song ends
audioElement.addEventListener('ended', nextSong);

// Initialize Annyang commands
if (annyang) {
    const commands = {
        'play': () => {
            audioElement.play();
            masterPlay.classList.remove('fa-play-circle');
            masterPlay.classList.add('fa-pause-circle');
            isPlaying = true;
            vizImage.style.opacity = '1'; // Show visualizer image smoothly
        },
        'pause': () => {
            audioElement.pause();
            masterPlay.classList.remove('fa-pause-circle');
            masterPlay.classList.add('fa-play-circle');
            isPlaying = false;
            vizImage.style.opacity = '0'; // Hide visualizer image smoothly
        },
        'next': () => {
            nextSong();
        },
        'previous': () => {
            previousSong();
        }
    };

    // Add commands to Annyang
    annyang.addCommands(commands);

    // Function to update voice command button text
    function updateVoiceButton() {
        const voiceButton = document.getElementById('voiceCommandButton');
        if (annyang.isListening()) {
            voiceButton.innerText = 'Voice Dormant';
        } else {
            voiceButton.innerText = 'Voice Active';
        }
    }

    // Initialize button text
    updateVoiceButton();

    // Event listener for the voice command button
    document.getElementById('voiceCommandButton').addEventListener('click', () => {
        if (annyang.isListening()) {
            annyang.abort();
            updateVoiceButton(); // Update button text
        } else {
            annyang.start();
            updateVoiceButton(); // Update button text
        }
    });
}
