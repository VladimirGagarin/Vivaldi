document.addEventListener('DOMContentLoaded', function () {
    const allSongArray = [];
    const songsInCantabileFolder = []
    let currentPlaylistGroup = [];
    let currentPlayIndex = 0;
    let currentsongPlaying = {
        icon: null,
        span:null,
        audio: null,
        music: null
    };
   
    const likedSongs = JSON.parse(localStorage.getItem("LikedSongs") || "[]");
    const listenedSongs = JSON.parse(localStorage.getItem("ListenedSongs") || "[]");
    const userplayList = JSON.parse(localStorage.getItem('UserPlaylist') || '[]');

    document.documentElement.scrollTop = 0;

    const vidLayout = document.querySelector(".video-layout");
    const trailer = vidLayout.querySelector('video');
    const playTrailerBtn= vidLayout.querySelectorAll('.song-controls .video-actions button')[0];
    const muteTrailer = vidLayout.querySelectorAll('.song-controls .video-actions button')[1];
    const TrailerProgressBar = vidLayout.querySelector('.song-controls .video-progress-truck .video-progress-bar');
    const trailerMessage = vidLayout.querySelector('.song-controls .video-actions span');
    let isPlayingTrailer = false;
    let isTrailerMuted = false;


    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.shiftKey && e.key === 'C') || (e.ctrlKey && e.shiftKey && e.key === 'J')) {
          e.preventDefault();
            showNotification('Not now for the moment.');
        }
    });
      
      
    const myMoods = [
        { mood: "Upbeat", description: "Energetic and lively songs, often with a fast tempo and positive energy.", reader:"cantabile/reader1.mp3",img:'images/emoji2.jpg' },
        { mood: "Happy", description: "Cheerful and light-hearted songs, designed to boost your spirits.", reader:"cantabile/reader2.mp3",img:'images/emoji1.jpg' },
        { mood: "Sad", description: "Songs that evoke sadness or melancholy feelings.", reader:"cantabile/reader3.mp3",img:'images/emoji3.jpg' },
        { mood: "Romantic", description: "Songs that convey love, affection, and romantic emotions.", reader:"cantabile/reader4.mp3",img:'images/emoji4.jpg' },
        { mood: "Motivational", description: "Songs that inspire and encourage action, often used for workouts or personal growth.", reader:"cantabile/reader5.mp3",img:'images/emoji5.jpg' },
        { mood: "Relaxing", description: "Calm, soothing songs that help with relaxation or stress relief.",reader:"cantabile/reader6.mp3",img:'images/emoji6.jpg' },
        { mood: "Angry", description: "Songs that express frustration, rage, or strong emotions.",reader:"cantabile/reader7.mp3",img:'images/emoji7.jpg' },
        { mood: "Mellow", description: "Smooth and gentle songs that create a laid-back atmosphere.",reader:"cantabile/reader8.mp3",img:'images/emoji8.jpg' },
        { mood: "Dreamy", description: "Songs with a soft, ethereal, or otherworldly vibe.",reader:"cantabile/reader9.mp3",img:'images/emoji9.jpg' },
        { mood: "Nostalgic", description: "Songs that evoke memories of the past, often bittersweet.",reader:"cantabile/reader10.mp3",img:'images/emoji10.jpg' },
        { mood: "Epic", description: "Grand, powerful songs often used in movie soundtracks or anthems.",reader:"cantabile/reader11.mp3",img:'images/emoji11.jpg' },
        { mood: "Chill", description: "Laid-back, easy-going songs, often associated with relaxing moments.",reader:"cantabile/reader12.mp3",img:'images/emoji12.jpg' },
        { mood: "Party", description: "High-energy songs for social gatherings, clubs, or celebrations.",reader:"cantabile/reader13.mp3",img:'images/emoji13.jpg' },
        { mood: "Melancholic", description: "Songs that reflect deep sadness or a reflective, sorrowful mood.",reader:"cantabile/reader14.mp3",img:'images/emoji14.jpg' },
        { mood: "Hopeful", description: "Songs that convey optimism, anticipation, or positive aspirations.",reader:"cantabile/reader15.mp3",img:'images/emoji15.jpg' },
        { mood: "Sentimental", description: "Songs that evoke deep emotions and affection, often tied to memories.",reader:"cantabile/reader16.mp3",img:'images/emoji16.jpg' },
        { mood: "Peaceful", description: "Calm and serene songs, perfect for unwinding and inner peace.",reader:"cantabile/reader17.mp3",img:'images/emoji17.jpg' },
        { mood: "Intense", description: "Songs that are dramatic and full of energy, creating a sense of urgency.",reader:"cantabile/reader18.mp3",img:'images/emoji18.jpg' },
        { mood: "Fun", description: "Light-hearted and playful songs, often associated with good times and laughter.",reader:"cantabile/reader19.mp3",img:'images/emoji19.jpg' },
        { mood: "Euphoric", description: "Songs that evoke intense joy or bliss, often with a dance or trance feel.",reader:"cantabile/reader20.mp3",img:'images/emoji20.jpg' }
    ];
    

    const myAlbums = [
        {
            albumName: "RnB",
            albumImage: "../images/rnb.jpg",
            description: "Smooth, soulful tunes to set the mood right."
        },
        {
            albumName: "Airwave Music",
            albumImage: "../images/airwave.jpg",
            description: "Feel the breeze of uplifting beats and serene melodies."
        },
        {
            albumName: "Chills",
            albumImage: "../images/chills.jpg",
            description: "Relax and unwind with soothing and calming sounds."
        },
        {
            albumName: "Twilight",
            albumImage: "../images/twilight.jpg",
            description: "Melodies as magical as the twilight hour."
        },
        {
            albumName: "Two Steps From Hell",
            albumImage: "../images/hell.jpg",
            description: "Epic and inspiring orchestral masterpieces."
        },
        {
            albumName: "Classical",
            albumImage: "../images/waltz.jpg",
            description: "Graceful rhythms for dreamy dances under the stars."
        },
        {
            albumName: "Disney",
            albumImage: "../images/disney.jpg",
            description: "Magical tunes that spark joy and nostalgia."
        },
        {
            albumName: "Ncs",
            albumImage: "../images/ncs.jpg",
            description: "Non-stop energy with no copyright beats."
        },
        {
            albumName: "Celine Dion",
            albumImage: "../images/celine.jpg",
            description: "Iconic ballads and heartfelt anthems from the queen of vocals."
        },
        {
            albumName: "Bongo",
            albumImage: "../images/bongo.jpg",
            description: "Vibrant African rhythms to get you moving."
        },
        {
            albumName: "Bollywood",
            albumImage: "../images/bollywood.jpg",
            description: "Bollywood beats that bring drama and romance to life."
        },
        {
            albumName: "Others",
            albumImage: "../images/others.jpg",
            description: "A mix of unique sounds for every curious ear."
        },
        {
            albumName: "Cool",
            albumImage: "../images/cool.jpg",
            description: "Refreshing vibes to keep you chill."
        }
    ];

    myMoods.forEach(m => {
        console.log(m.mood)
    })

    const vivaldiQuotes = [
        "Music is the rhythm of life, a melody that weaves through our souls, and a harmony that unites our hearts.",
        "Every note is a heartbeat, every melody a story waiting to be heard.",
        "Through music, we find not just sound, but the essence of life itself.",
        "Life's beauty unfolds in the symphonies we create and the harmonies we share.",
        "A single note can stir emotions that words could never express.",
        "Music is the bridge that connects moments, memories, and dreams.",
        "In every melody lies a whisper of the universe, reminding us of our shared humanity.",
        "Life without music is like a canvas without color—silent and incomplete.",
        "Music is not just sound; it’s a language of the soul that everyone understands.",
        "The rhythm of life finds its pulse in the beats of a timeless melody.",
        "In the silence between notes, we discover the beauty of the unknown.",
        "Music is the timeless dance of emotion, weaving through the tapestry of life.",
        "Through music, the past and present converse in perfect harmony.",
        "A crescendo that transcends the bounds of eternity.",
        "Melodies are the footprints of the heart, marking the journey of life."
    ];
    
    

    function displayMainPageSchema() {
        // Fetch the song.json data
        fetch('../songs.json')
        .then(response => response.json())
        .then(songs => {
            songs.forEach(song => {
                // Prepare artists' data based on available information
                const genres = [];
                const artists = [];

                songs.forEach(song => {
                    if (!genres.includes(song.songGenre)) {
                        genres.push(song.songGenre);
                    }
                    if (!artists.includes(song.songArtist1)) {
                        artists.push(song.songArtist1);
                    }
                    if (song.songArtist2 && !artists.includes(song.songArtist2)) {
                        artists.push(song.songArtist2);
                    }
                });
                const playbackUrl = `../songs/index.html?song=${encodeURIComponent(song.songName)}`;
                
                // Generate JSON-LD Schema for the song
                const songSchema = {
                    "@context": "http://schema.org",
                    "@type": "Song",
                    "name": song.songName,
                    "genre": song.songGenre,
                    "keywords": song.songKeyWord,
                    "mood": song.songMood,
                    "artist": song.songArtist1,
                    "url": playbackUrl
                };
    
                // Add the generated schema to the HTML document
                const script = document.createElement('script');
                script.type = 'application/ld+json';
                script.textContent = JSON.stringify(songSchema);
                document.head.appendChild(script);
            });
        })
        .catch(error => console.error('Error fetching song data:', error));
    };

    (function () {
        fetch("../songs.json")
            .then((response) => {
                // Check if the response is OK (status code 200-299)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // Parse the JSON data
            })
            .then((data) => {
                // Assuming data is an array of songs
                allSongArray.push(...data);
                console.log("Songs loaded successfully:", allSongArray.length);
                displayMainPageSchema();
                populateHomepage();
                myFavSong();
            })
            .catch((err) => {
                console.error("Error fetching songs:", err);
                displayReloadPage();
            });
    })();

  
    


    function shuffleArray(array) {
        const arrayTobeShuffled = array;
    
        for (let i = arrayTobeShuffled.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1)); // Correct random index
            [arrayTobeShuffled[i], arrayTobeShuffled[randomIndex]] = [arrayTobeShuffled[randomIndex], arrayTobeShuffled[i]]; // Swap elements
        }
    
        return arrayTobeShuffled;
    }
    

    function populateHomepage() {
        const moodContainer = document.querySelector('main #moods ul');
        const songContainer = document.querySelector('main #featured-songs ul');
        const albumContainer = document.querySelector('main #featured-artist ul');
        const shuffledMoods = shuffleArray(myMoods);

       shuffledMoods.forEach(m => {
            
            createLiElements(moodContainer, `${m.mood}`, playMoodSongs, m);
        });



        const shuffledSongs = shuffleArray(allSongArray);
        
        const topSongs = shuffledSongs.length > 20 ? shuffledSongs.slice(0, 20) : shuffledSongs;

        topSongs.forEach(song => {
            createLiElements(songContainer, song.songName, playSongsAsCurrentSong, song);
        });


        const shuffledAlbums = shuffleArray(myAlbums);
        
        shuffledAlbums.forEach(album => {
            const songswthLabumName = allSongArray.filter(song => song.songGenre === album.albumName)
            createLiElements(albumContainer, `${album.albumName}  (+${songswthLabumName.length})`, displayAlbum, album)
        });

        moodContainer.querySelectorAll('li').forEach(li => {
            const bgImg = myMoods.find(m => li.textContent.includes(m.mood));
            if(bgImg) {
                li.style.backgroundImage = `url('${bgImg.img}')`;
            }
        });

        albumContainer.querySelectorAll('li').forEach(li => {
            const bgImg = myAlbums.find(al => li.textContent.includes(al.albumName));
            if(bgImg) {
                li.style.backgroundImage = `url('${bgImg.albumImage}')`;
            }
        })

       
    }

    function createLiElements(container, text, action = () => {}, ...args) {
        if (!container || !(container instanceof HTMLElement)) {
            return;
        }
    
        const fragment = document.createDocumentFragment();
    
        const newLi = document.createElement("li");
        newLi.innerHTML = `<span>${text}</span>`;
    
        // Assign the click handler
        newLi.onclick = () => action(...args);
    
        // Append the newLi to the fragment
        fragment.appendChild(newLi);
    
        // Append the fragment to the container
        container.appendChild(fragment);
    }
        
    
    function displayReloadPage() {
        console.log("No Songs Goodbye");
    }



    function displayAlbum(album) {
       const albumOverlay = document.querySelector('.overlay-album-songs');
       const albumSongContainer = document.querySelector('.overlay-content-songs ul');
       const albumCloseOverlay = document.querySelector('.close-overlay-album');

       albumSongContainer.innerHTML = '';

       let delayedSuggestion;

       albumCloseOverlay.onclick = function () {
            albumOverlay.style.display = 'none';
            clearTimeout(delayedSuggestion);
       }

       const songsWithAlbum = allSongArray.filter(song => song.songGenre === album.albumName);

       if(songsWithAlbum.length === 0) {
            showNotification(`No songs in this album ${album.albumName}`);
            return;
       }

       albumOverlay.style.display = 'flex';
       albumOverlay.style.backgroundImage = `url('${album.albumImage}')`;

       songsWithAlbum.forEach(song => {
        createLiElements(albumSongContainer, song.songName, playSongsAsCurrentSong, song);
       });

       albumSongContainer.onclick = function() {
            clearTimeout(delayedSuggestion);
       }


       delayedSuggestion = setTimeout(function() {
            const randomIndex = Math.floor(Math.random() * songsWithAlbum.length);
            const suggestsong = songsWithAlbum[randomIndex];
            playSongsAsCurrentSong(suggestsong);
            clearTimeout(delayedSuggestion);
       },songsWithAlbum.length * 10000);
    }


    function playMoodSongs(mood) {
        // Filter songs based on the given mood
        const songsWithSameMood = allSongArray.filter(song => song.songMood.includes(mood.mood));
    
        // Handle cases where no songs are found
        if (songsWithSameMood.length === 0) {
        showNotification(`No songs found for the mood: "${mood}".`);
            return;
        }
    
        // Select a random song from the filtered list
        const randomSongIndex = Math.floor(Math.random() * songsWithSameMood.length);
        const selectedSong = songsWithSameMood[randomSongIndex];
    
        // Save the selected song to localStorage
        if (selectedSong) {
            localStorage.setItem('currentSong', JSON.stringify(selectedSong));
            localStorage.setItem('songSource', 'mood');
            localStorage.setItem('currentMood', mood.mood);
        } else {
           showNotification("Error: Failed to select a song for the mood.");
            return;
        }
    
        const reader = new Audio(mood.reader);

        reader.play();

        reader.addEventListener('ended', () => {
            setTimeout(function () {
                // Redirect to the song playback page
                window.location.href = '../songs';
            },5000);
        });

        reader.onerror = function () {
            // Redirect to the song playback page
            window.location.href = '../songs';
        }
    }
    

    function playSongsAsCurrentSong(song) {
        localStorage.setItem('currentSong', JSON.stringify(song));
        localStorage.setItem('songSource', 'album');
        window.location.href = '../songs';
    }

    document.querySelector('#startPlayListBtn').onclick = function() {
        this.disabled = true;
        displaySongsForPlaylst();
    };
    
    function displaySongsForPlaylst() {
        const  playListOv = document.querySelector('.create-playlist-arena');
        const startBtn =  document.querySelector('#startPlayListBtn');
        const albumContainer = document.querySelector('.playlist-preview .left-playlist ul');
        const songsContainer = document.querySelector('.playlist-preview .right-playlist ul');
        const closeBtn = playListOv.querySelectorAll('.header-content .action-header-playlist button')[1];
        const doneBtn = playListOv.querySelectorAll('.header-content .action-header-playlist button')[0];
        const inputfield = playListOv.querySelector('.playlist-input input');

        
        let highlightedSongs = [];

        songsContainer.innerHTML = '';
        playListOv.style.display = 'block';

        myAlbums.forEach(al => {
            createLiElements(albumContainer, al.albumName,  displayCorrespondingSongs, al.albumName)
        });

        function displayCorrespondingSongs(albumName) {
            const songsWithAlbumName = allSongArray.filter(song => song.songGenre === albumName);
           

            if(songsWithAlbumName.length === 0) {
                showNotification("no songs available");
                return;
            }

            songsContainer.innerHTML = '';

            songsWithAlbumName.forEach(song => {
                const newLisongs = document.createElement('li');

                newLisongs.innerHTML = `
                <div class="name-of-song"><span>${song.songName}</span></div>
                <div class="selection">
                    <input type="checkbox"title='select here'>
                </div>`

                songsContainer.appendChild(newLisongs);

                const checkbox = newLisongs.querySelector('.selection input');
                checkbox.checked = highlightedSongs.some((s) => s.songKeyWord === song.songKeyWord);
    
                checkbox.onchange = function () {
                    if (checkbox.checked) {
                        highlightedSongs.push(song);
                    } else {
                        highlightedSongs = highlightedSongs.filter((s) => s.songKeyWord !== song.songKeyWord);
                    }
                };
            });
        }

        inputfield.oninput = function () {
            doneBtn.disabled = inputfield.value.trim() === '';
        }

        doneBtn.onclick = function () {
            if(highlightedSongs.length === 0) {
                showNotification("No songs selected.Please select song(s) to create playlist");
                doneBtn.disabled = true;
                inputfield.value = '';
                return;
            }

            const newPlaylist = {
                name: inputfield.value.trim(),
                songs: [...highlightedSongs],
            };

            userplayList.push(newPlaylist);
            // Save to localStorage
            localStorage.setItem('UserPlaylist', JSON.stringify(userplayList));

            // Reset UI
            doneBtn.disabled = true;
            inputfield.value = '';
            highlightedSongs = [];
            songsContainer.innerHTML = '';
            albumContainer.innerHTML = '';
            playListOv.style.display = 'none';
            startBtn.disabled = false;
            showNotification(`Playlist "${newPlaylist.name}" saved successfully!`);

            if(userplayList.length > 0) {
                displayUserPlayList()
            }
        }

        closeBtn.onclick = function () {
            doneBtn.disabled = true;
            songsContainer.innerHTML = '';  
            albumContainer.innerHTML = '';
            inputfield.value = '';
            startBtn.disabled = false;
            highlightedSongs = [];
            playListOv.style.display = 'none';
        }
    }

    if(userplayList.length > 0) {
        displayUserPlayList()
    }

    if(likedSongs.length > 3){
        displayUserPlayList();
    }

    function createLikedSongsPlaylist() {
        const maxLikedSongs = 10; // Limit the liked songs playlist to 10 songs
        const shuffledLikedSongs = shuffleArray(likedSongs);
        const likedSongsPlaylist = {
            name: "Serenade Collection",
            songs: shuffledLikedSongs.slice(0, maxLikedSongs), // Get up to 10 songs
        };
    
        // If no liked songs, show notification and return
        if (likedSongsPlaylist.songs.length <= 3) {
            return null;
        }
    
        return likedSongsPlaylist;
    }

    function displayUserPlayList() {
        const container = document.querySelector('main #archives');
        const playlistContainer = container.querySelector('ul');

        // Combine user playlists with the liked songs playlist
        const likedSongsPlaylist = createLikedSongsPlaylist();
        const combinedPlaylists = likedSongsPlaylist
            ? [likedSongsPlaylist, ...userplayList]
            : userplayList;

        if (!Array.isArray(combinedPlaylists) || combinedPlaylists.length === 0) {
            container.style.display = 'none';
            return;
        }

        playlistContainer.innerHTML = ''; // Clear previous content
    
       combinedPlaylists.forEach(playlist => {
            const newPlayListLi = document.createElement('li');
            newPlayListLi.style.position = 'relative'; // To position delete button properly
    
            // Inner HTML for the playlist item
            newPlayListLi.innerHTML = `
                ${(playlist.name !== "Serenade Collection") ? '<button class="delete-btn">&times;</button>' : ''}
                <div class="Playlist-name">${playlist.name}</div>
            `;
    
            // Append to container
            playlistContainer.appendChild(newPlayListLi);
    
            // Add event listener for playing songs in the playlist
            newPlayListLi.onclick = function () {
                PlaySongInPlaylist(playlist.songs, playlist.name);
            };
    
            // Add event listener for delete button (only for user-created playlists)
            if (playlist.name !== "Serenade Collection") {
                const deleteBtn = newPlayListLi.querySelector('.delete-btn');
                deleteBtn.onclick = function (event) {
                    event.stopPropagation(); // Prevent triggering the play event
                    deletePlaylist(playlist, newPlayListLi); // Call your delete function
                };
            }

            if (playlist.name === "Serenade Collection") {
                newPlayListLi.setAttribute('title', 'Your most cherished tunes!');
                newPlayListLi.classList.add('highlight');
            }
            
        });
    
        container.style.display = 'flex';
    }

    function deletePlaylist(playlist, newPlayListLi){
        
        if (!Array.isArray(userplayList)) {
            showNotification("No playlists found.");
            return;
        }

        const isPlayListExist = userplayList.find(p => p.name === playlist.name);

        if(isPlayListExist) {
            const confirmDelete = confirm(`Are you sure you want to delete the playlist "${playlist.name}"?`);
            if (!confirmDelete) return;

            const index = userplayList.findIndex(p => p.name === isPlayListExist.name);
            userplayList.splice(index, 1);
            localStorage.setItem("UserPlaylist", JSON.stringify(userplayList));
            newPlayListLi.remove();
            showNotification(`Playlist "${playlist.name}" has been deleted.`);

            if(userplayList.length === 0) {
                document.querySelector('main #archives').style.display = 'none';
            }
        }
        else{
            showNotification("Your Playlist Doesn't Exist");
        }
    }

    function PlaySongInPlaylist(arr, playlistName, songExist = null){
        const  playListOv = document.querySelector('.create-playlist-arena');
        const startBtn =  document.querySelector('#startPlayListBtn');
        const overlay = document.querySelector('.overlay-song-playlist-view');
        const container = overlay.querySelector('.song-view-content ul');
        const closeOverlay = overlay.querySelector('.close-overlay-play-view');
        const title = overlay.querySelector('h2 span');

        container.innerHTML = '';
    
        title.textContent = playlistName + `( ${arr.length} )`;

        const shuffledPlaylist = shuffleArray(arr)
        currentPlaylistGroup = [...shuffledPlaylist];
        let currentElement = null;

        arr.forEach((song, index)=> {
            const newLisongs = document.createElement('li');

            newLisongs.innerHTML = `
            <div class="song-title-view"><span>${index + 1}.</span><span>${song.songName}</span></div>
            <div class="play-icon-timespan">
                <span><i class="fa fa-eye"></i></span>
                <span>00 : 00 / 00 : 00 </span>
                <span>&#9654;</span>
            </div>`;

            container.appendChild(newLisongs);
            const playIcon = newLisongs.querySelectorAll('.play-icon-timespan span')[2];
            const timeSpan = newLisongs.querySelectorAll('.play-icon-timespan span')[1];
            const hideicon = newLisongs.querySelectorAll('.play-icon-timespan span')[0];

            let isHidden = false;
            
            newLisongs.onclick = function () {
                const newSongSrc = new Audio(`../${song.songUrl}`);
                container.querySelectorAll('li').forEach(li => {li.classList.remove('active')});
                
                if(newLisongs.classList.contains('hidden')) {
                    newLisongs.classList.remove('active');
                    makeCurrentElementActive();
                    showNotification("Can't be played because it is not allowed");
                    return;
                }
                playSongAsCurrentPlaylistSong(newSongSrc, playIcon, timeSpan, song);
                currentPlayIndex =  index;
                console.log("currentPlayIndex", currentPlayIndex);
                currentElement = newLisongs;
                currentElement.classList.add('active');
            }

            hideicon.onclick = function (event){
                event.stopPropagation();
                isHidden = !isHidden;

                hideicon.innerHTML = isHidden ? '<i class="fa fa-eye-slash"></i>' : '<i class="fa fa-eye"></i>';
                newLisongs.classList.toggle('hidden', isHidden);
            }
        });

        const firstSong = songExist ? songExist.song : currentPlaylistGroup[0];
        const firstItem =  Array.from(container.querySelectorAll('li')).find(li => li.querySelectorAll('.song-title-view span')[1].textContent === firstSong.songName);
        container.querySelectorAll('li').forEach(li => {li.classList.remove('active')});
        if(firstItem) currentElement = firstItem;
        currentElement.classList.add('active');
        const firstChildPlayIcon =  currentElement.querySelectorAll('.play-icon-timespan span')[2];
        const firstChildTimeSpan = currentElement.querySelectorAll('.play-icon-timespan span')[1];
        const newSongUrl = new Audio(`../${firstSong.songUrl}`);
        newSongUrl.currentTime = songExist ? songExist.time : 0;
        currentPlayIndex = currentPlaylistGroup.findIndex(s => s.songName === firstSong.songName);
        playSongAsCurrentPlaylistSong(newSongUrl, firstChildPlayIcon, firstChildTimeSpan, firstSong);
        
        function makeCurrentElementActive() {
            currentElement.classList.add('active');
            container.querySelectorAll('li').forEach(li => {
                li.querySelectorAll('.play-icon-timespan span')[0].style.opacity = 1;
                li.querySelectorAll('.play-icon-timespan span')[0].style.pointerEvents = 'auto';
                li.querySelectorAll('.play-icon-timespan span')[0].style.color = '#f4f4f4';
            })
            currentElement.querySelectorAll('.play-icon-timespan span')[0].style.opacity = 0.2;
            currentElement.querySelectorAll('.play-icon-timespan span')[0].style.pointerEvents = 'none';
            currentElement.querySelectorAll('.play-icon-timespan span')[0].style.color = 'red';
        }

        overlay.style.display = 'flex';
        playListOv.style.display = 'none';
        startBtn.disabled = false;

        closeOverlay.onclick = function () {
            currentPlayIndex = 0;
            currentPlaylistGroup = [];
            overlay.style.display = 'none';

            if(currentsongPlaying && currentsongPlaying.audio && currentsongPlaying.icon && currentsongPlaying.span) {
                currentsongPlaying.audio.pause();
                currentsongPlaying.icon.innerHTML = '&#9654;';
                currentsongPlaying.span.textContent = '00 : 00 / 00 : 00';
                currentsongPlaying.currentTime = 0;
            }
            currentsongPlaying = { icon: null, span: null, audio: null };

            savePlaylistState(playlistName,currentPlaylistGroup,0, 0, false)

        }

        function playSongAsCurrentPlaylistSong(songSrc, playIcon, timeSpan, song) {

            if (currentsongPlaying.audio && currentsongPlaying.audio.src !== songSrc.src) {
                currentsongPlaying.audio.pause();
                currentsongPlaying.audio.currentTime = 0; // Reset playback only for different songs
                currentsongPlaying.icon.innerHTML = '&#9654;'; // Update to "Play"
                currentsongPlaying.span.textContent = '00 : 00 / 00 : 00'; // Reset time display
            } else if (currentsongPlaying.audio && currentsongPlaying.audio.src === songSrc.src && !currentsongPlaying.audio.paused) {
                currentsongPlaying.audio.pause();
                playIcon.innerHTML = '&#9654;'; // Update to "Play"
                return;
            }          
            
            
             
             // Update current song details
            currentsongPlaying = { audio: songSrc, icon: playIcon, span: timeSpan, music: song };


            currentsongPlaying.audio.play().then(() => {
                playIcon.innerHTML = '&#10074;&#10074;';
                title.textContent = playlistName + `( ${currentPlayIndex + 1} / ${arr.length} )`;
                showNotification(`Playing...${song.songName}`, "../logo.jpg");
                makeCurrentElementActive();
            }).catch(err => {
                console.error(err);
               playIcon.innerHTML = '&#9654;';
            });

            const liElementWithSong = Array.from(container.querySelectorAll('li')).find(li => li.querySelector('.song-title-view span').textContent === song.songName);
            if(liElementWithSong) {
                 container.querySelectorAll('li').forEach(li => li.classList.remove('active'));
                 liElementWithSong.classList.add('active');
            }

            currentsongPlaying.audio.addEventListener('timeupdate', () => {
                const duration = !isNaN(currentsongPlaying.audio.duration) ? formattedTime(currentsongPlaying.audio.duration) : "00 : 00";
                timeSpan.textContent = `${formattedTime(currentsongPlaying.audio.currentTime)} / ${duration}`;

                savePlaylistState(playlistName,currentPlaylistGroup, currentPlayIndex, currentsongPlaying.audio.currentTime, true);
            });

            

            currentsongPlaying.audio.addEventListener('ended', () => {
                console.log("Checking for song:", song.songName);
            
                playIcon.innerHTML = '&#9654;';
                timeSpan.textContent = '00 : 00 / 00 : 00';
                playIcon.parentElement.parentElement.classList.remove('active');
            
                // Helper function to find the next playable song
                const getNextPlayableSong = (startIndex) => {
                    let nextIndex = startIndex;
                    do {
                        nextIndex = (nextIndex + 1) % currentPlaylistGroup.length;
                        const nextSongLi = container.querySelectorAll('li')[nextIndex];
                        if (!nextSongLi.classList.contains("hidden")) {
                            return { song: currentPlaylistGroup[nextIndex], index: nextIndex, li: nextSongLi };
                        }
                    } while (nextIndex !== startIndex);
            
                    // Return null if no playable song is found (all are hidden)
                    return null;
                };
            
                // Get the next playable song
                const nextPlayable = getNextPlayableSong(currentPlayIndex);
            
                if (nextPlayable) {
                    currentPlayIndex = nextPlayable.index;
                    const nextSong = nextPlayable.song;
                    const nextLi = nextPlayable.li;
            
                    const nextPlayIcon = nextLi.querySelectorAll('.play-icon-timespan span')[2];
                    const nextTimeSpan = nextLi.querySelectorAll('.play-icon-timespan span')[1];
                    const nextSongSrc = new Audio(`../${nextSong.songUrl}`);
                    
                    currentElement = nextLi;
                    playSongAsCurrentPlaylistSong(nextSongSrc, nextPlayIcon, nextTimeSpan, nextSong);
                    nextLi.classList.add('active');
                } else {
                    showNotification("No more playable songs in the playlist.");
                }
            });
            
   
            currentsongPlaying.audio.addEventListener('error', () => {
                currentsongPlaying.icon.style.display = 'none';
                container.style.pointerEvents = 'none';
                document.querySelector('.loading-content').style.display = 'flex';

            
                savePlaylistState(playlistName,currentPlaylistGroup, 0, 0, false)
            });

            currentsongPlaying.audio.addEventListener('waiting', () => {
                currentsongPlaying.icon.style.display = 'none';
                container.style.pointerEvents = 'none';
                document.querySelector('.loading-content').style.display = 'flex';
            });

            currentsongPlaying.audio.addEventListener('pause', () => {

               
                savePlaylistState(playlistName,currentPlaylistGroup,0, 0, false)
            });

            currentsongPlaying.audio.addEventListener('stalled', () => {
                currentsongPlaying.icon.style.display = 'none';
                container.style.pointerEvents = 'none';
                document.querySelector('.loading-content').style.display = 'flex';

                savePlaylistState(playlistName,currentPlaylistGroup,  currentPlayIndex, currentsongPlaying.audio.currentTime,true)
            });

            currentsongPlaying.audio.addEventListener('loadedmetadata', () => {
                currentsongPlaying.icon.style.display = 'block';
                currentsongPlaying.icon.innerHTML = '&#10074;&#10074;';
                container.style.pointerEvents = 'auto';
                document.querySelector('.loading-content').style.display = 'none';
            });

            currentsongPlaying.audio.addEventListener('playing', () => {
                currentsongPlaying.icon.style.display = 'block';
                currentsongPlaying.icon.innerHTML = '&#10074;&#10074;';
                container.style.pointerEvents = 'auto';
                document.querySelector('.loading-content').style.display = 'none';
            });

            function formattedTime(currentAudio) {
                const min = Math.floor(currentAudio / 60);
                const sec = Math.floor(currentAudio % 60);
    
                const fmin = min < 10 ? `0${min}` : min;
                const fsec = sec < 10 ? `0${sec}` : sec;
    
                return `${fmin} : ${fsec}`;
            }
        }

        
    }

    function savePlaylistState(playlistName,arr,index, time, state) {
        localStorage.setItem('currentPlaylist', JSON.stringify({
            name : playlistName,
            songs: arr,
            currentIndex: index,
            currentTime: time,
            isPlaying: state,
        }));
        
    }

     // Restore playlist state
    function restorePlaylistState() {
        const savedState = JSON.parse(localStorage.getItem('currentPlaylist'));
        if (savedState && savedState.isPlaying) {
            return savedState;
        }
        return null;
    }

    // Resume playlist after reload
    function resumePlaylist() {
        const savedState = restorePlaylistState();
        if (savedState) {

            const resumeDiv = document.createElement('div');
            resumeDiv.className = 'resume-overlay';
            resumeDiv.innerHTML = `
                <div class="resume-content">
                    <p>Would you like to resume the song ${savedState.songs[savedState.currentIndex].songName} in  playlist "${savedState.name}"?</p>
                    <button id="resumePlaylistBtn">Yes</button>
                    <button id="cancelResumeBtn">No</button>
                </div>`;
            document.body.appendChild(resumeDiv);

            document.getElementById('resumePlaylistBtn').onclick = () => {
                document.body.removeChild(resumeDiv);
                const songToResume = savedState.songs[savedState.currentIndex];
                const durationToresume = savedState.currentTime;
                const index = savedState.currentIndex;
                const foundedSong = {song:songToResume, time: durationToresume, number:index}
                PlaySongInPlaylist(savedState.songs, savedState.name, foundedSong);

                localStorage.removeItem('currentPlaylist');
            };

            document.getElementById('cancelResumeBtn').onclick = () => {
                document.body.removeChild(resumeDiv);
                localStorage.removeItem('currentPlaylist');
            };
        }
    }

   

    function showNotification(message, img = "../logo.jpg") {
        const notificationContainer = document.querySelector('.notification-section');
        const notificationImage = notificationContainer.querySelector('.img img');
        const notificationMsg = notificationContainer.querySelector('.message-section span');
    
        // Clear previous content
        notificationImage.src = '';
        notificationMsg.textContent = '';
    
        // Set new content
        notificationMsg.textContent = message;
        notificationImage.src = img;
    
        if (Notification.permission === "granted") {
            if (document.visibilityState !== "visible") {
                // Show browser notification if the page is not visible
                const browserNotification = new Notification("Vivaldi Cantabile", {
                    body: message,
                    icon: "../logo.jpg",
                    image: img,
                });
    
                // Optional: Add click event to bring the user back to the page
                browserNotification.onclick = () => window.focus();
            } else {
                // Show the custom notification div if the page is visible
                notificationContainer.style.display = "flex";
                setTimeout(() => {
                    notificationContainer.style.display = "none";
                }, 5000); // Hide after 5 seconds
            }
        } else {
            // Request notification permissions if not already granted
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    // Re-trigger the notification after permission is granted
                    showNotification(message, img);
                } else {
                    // Show the custom notification div as a fallback
                    notificationContainer.style.display = "flex";
                    setTimeout(() => {
                        notificationContainer.style.display = "none";
                    }, 5000);
                }
            });
        }

        notificationContainer.onclick = function () {
            notificationContainer.style.display = "none";
        }
    }

    const anthems = [
        {anthem:"cantabile/Anthem B.mp3", img: "images/ussrFlag.gif" },
        {anthem:"cantabile/Anthem C.mp3",img: "images/eaFlag.gif"},
    ];

    const eastAfricanCountries = {
        "Kenya": "KE",
        "Uganda": "UG",
        "Tanzania": "TZ",
        "Rwanda": "RW",
        "Burundi": "BI",
        "South Sudan": "SS",
        "Ethiopia": "ET",
        "Somalia": "SO",
        "Djibouti": "DJ",
        "Eritrea": "ER"
    };

    function getUserCountry() {
        return new Promise((resolve) => {
            fetch('https://ip-api.com/json')
                .then(response => response.json())
                .then(data => {
                    const countryCode = data.countryCode;
                    console.log(allSongArray.length);
                    // Check if the country code belongs to East African countries
                    const isEastAfrican = Object.values(eastAfricanCountries).includes(countryCode);
                    resolve(isEastAfrican); 
                })
                .catch(error => {
                    resolve(false);
                });
        });
    }
    

    //Uncaught (in promise) NotAllowedError: play() failed because the user didn't interact with the document first.
    const startingPage = document.querySelector('.starting-page');
    const skipBtn = startingPage.querySelector('button');
    const timer = startingPage.querySelector('p span');
    let counter = 6;
    let counterInterval;
   
    if (!sessionStorage.getItem('introShown')) { 

        getUserCountry().then(isFromEastAfrica => {
            const chosenAnthem = new Audio(anthems[isFromEastAfrica ? 1 : 0].anthem);
            chosenAnthem.preload = "auto";
        
            startingPage.style.backgroundImage = `url('${anthems[isFromEastAfrica ? 1 : 0].img}')`;
            chosenAnthem.addEventListener("loadedmetadata", () => {
                // Set interval with a 1000ms (1 second) delay to decrement the counter every second
                counterInterval = setInterval(function() {
                    counter--;
                    timer.textContent = `In ${counter}`;
            
                    if (counter <= 0) {
                        timer.textContent = ``;
                        clearInterval(counterInterval);
                        skipBtn.disabled = false;
                        skipBtn.textContent = "Lets Start";


                        skipBtn.addEventListener('click', () => {
                            chosenAnthem.play().catch(error => {
                                console.error("Playback failed:", error);
                            });
            
                            skipBtn.disabled = true;
                            timer.textContent = formattedTime(chosenAnthem.duration);
                        });
                    }
                }, 1000); // 1 second interval for the countdown
                let countDown; // Declare countDown globally to persist its value
                let thisInterval; // Declare interval reference globally to manage it


                chosenAnthem.ontimeupdate = function () {
                    const aQuarterDuration = Math.floor((chosenAnthem.duration * 1) / 4);
                
                    // Start countdown only once
                    if (!thisInterval && !countDown) {
                        countDown = aQuarterDuration;
                        skipBtn.textContent = `Checking...(${countDown})`;
                
                        thisInterval = setInterval(() => {
                            countDown--;
                            if (countDown > 0) {
                                skipBtn.textContent = `Checking...(${countDown})`;
                            } else {
                                clearInterval(thisInterval);
                                thisInterval = null; // Reset interval reference
                            }
                        }, 1000);
                    }
                
                    // Enable the button when the time condition is met
                    if (chosenAnthem.currentTime >= aQuarterDuration) {
                        skipBtn.disabled = false;
                        skipBtn.textContent = "View Page";
                
                        // Clear the interval to stop the countdown
                        clearInterval(thisInterval);
                        thisInterval = null;

                        skipBtn.onclick = function () {
                            closeIntroPage();
                        }
                    }
                };
                

                
            });

            chosenAnthem.addEventListener('timeupdate', function() {
                // Calculate remaining time by subtracting currentTime from the duration
                const remainingTime = chosenAnthem.duration - chosenAnthem.currentTime;
                timer.textContent = formattedTime(remainingTime); // Display the countdown time
            });

            chosenAnthem.onerror = () => {
                closeIntroPage();
            }

            chosenAnthem.onended = function () {
                closeIntroPage();
            }
            
            

            function closeIntroPage() {
                chosenAnthem.pause();
                chosenAnthem.currentTime = 0;
                startingPage.style.display = 'none';
                clearInterval(counterInterval);
                resumePlaylist(); // Call to check and resume playlist
                sessionStorage.setItem('introShown', 'true'); // Set the flag
            }

            function formattedTime(currentAnthem) {
                const min = Math.floor(currentAnthem / 60);
                const sec = Math.floor(currentAnthem % 60);

                const fmin = min < 10 ? `0${min}` : min;
                const fsec = sec < 10 ? `0${sec}` : sec;

                return `${fmin} : ${fsec}`;
            } 
        }) 
    }else{
        // Skip the intro page entirely if it has already been shown in this session
        document.querySelector('.starting-page').style.display = 'none';
        resumePlaylist(); 
    }

    const songHolder = document.querySelector('.song-list ul');
    let currentFile = null;

    document.getElementById("songInput").onchange = function () {
        const files = this.files;
        if (files && files.length > 0) {
            // Convert the FileList to an array
            Array.from(files).forEach((file, index) => {
                createLiElements(songHolder, file.name.replace(".mp3", ''), copyFileDetails, file, index);
            });
        }
    };

    function copyFileDetails (file, index) {
        const text = {
            songName: file.name.replace(".mp3", '').replace('y2mate.com - ', ''). replace('tomp3.cc - ', '').replace("Lyrics", '').replace("Video", ''),
            songUrl: `cantabile/${file.name}`,
            songGenre: "RnB",
            songId: `RnB_0${index + 161}`,
            songArtist1: "",
            songArtist2: "",
            songMood: ["", "", ""],
            songKeyWord: file.name.replace(".mp3", '').replace('y2mate.com - ', ''). replace('tomp3.cc - ', '').slice(6).replace("Lyrics", '').replace("Video", '')
        }

        // Convert the text object to a string
        const textToCopy = JSON.stringify(text, null, 2); // This will format the object nicely

        // Copy to clipboard
        navigator.clipboard.writeText(textToCopy).then(() => {
            console.log("File details copied to clipboard!");
        }).catch(err => {
            console.error("Failed to copy: ", err);
        });

       const clickedLi = Array.from(songHolder.querySelectorAll('li')).find(li => li.textContent === file.name.replace(".mp3", ''));

        if(clickedLi) {
            clickedLi.classList.add('clicked');
        }

        const newAudio = new Audio(URL.createObjectURL(file));
        PlaySelectedFile(newAudio);
    }    
    
   function PlaySelectedFile(newAudio) {
        if(currentFile && currentFile !== newAudio) {
            currentFile.pause();
        }

        currentFile = newAudio;

        currentFile.play();

        currentFile.onerror  = () => {
            showNotification("No Audio file to be played");
        }
   }

    trailer.onclick = function () {
        isPlayingTrailer = !isPlayingTrailer;
        playTrailerBtn.innerHTML = isPlayingTrailer ? '&#10074;&#10074;' : '&#9654;'
        if(isPlayingTrailer) {
            trailer.play();
        }
        else{
            trailer.pause();
        }
    }

   
    playTrailerBtn.onclick = function () {
        isPlayingTrailer = !isPlayingTrailer;
        playTrailerBtn.innerHTML = isPlayingTrailer ? '&#10074;&#10074;' : '&#9654;'
        
        if(isPlayingTrailer) {
            trailer.play();
        }
        else{
            trailer.pause();
        }
    }

    trailer.onended = function () {
        isPlayingTrailer = false;
        playTrailerBtn.innerHTML = isPlayingTrailer ? '&#10074;&#10074;' : '&#9654;'
        TrailerProgressBar.style.backgroundColor = 'red';
        trailerMessage.textContent = 'Ended';
        setTimeout(() => {
            trailerMessage.textContent = '';
            TrailerProgressBar.style.width = `0`;
            TrailerProgressBar.style.backgroundColor = '#007BFF';
        },3000);
    }
    trailer.onerror = function () {
       trailerMessage.textContent = 'Error playing Video';
       TrailerProgressBar.style.width = `100%`;
       TrailerProgressBar.style.backgroundColor = 'red';
       setTimeout(() => {
            trailerMessage.textContent = 'Try reload your device';
        },3000);
    }

    trailer.addEventListener('play', function () {
        trailerMessage.textContent = "Playing...";
        setTimeout(() => {
            trailerMessage.textContent = '';
        },3000);
    });

    trailer.addEventListener('playing', function () {
        setTimeout(() => {
            if(isTrailerMuted) {
                trailerMessage.textContent = 'Video is muted';
            }
            else{
                trailerMessage.textContent = '';
            }
        },3000);

        trailer.classList.remove('blur');
    });

    trailer.addEventListener('pause', function () {
        trailerMessage.textContent = "Paused...";
        setTimeout(() => {
            if(isTrailerMuted) {
                trailerMessage.textContent = 'Video is muted';
            }
            else{
                trailerMessage.textContent = '';
            }
        },3000);
    });

    trailer.addEventListener('stalled', function () {
        trailerMessage.textContent = "Just a moment...";
        setTimeout(() => {
            trailerMessage.textContent = "Exspectatio musica...";
        },3000);

        trailer.classList.add('blur');
    });

    trailer.addEventListener('waiting', function () {
        trailerMessage.textContent = "Just a moment...";
        setTimeout(() => {
            trailerMessage.textContent = 'Interludio temporis...';
        },3000);
    });

    trailer.addEventListener('timeupdate', function() {
        const percent = (trailer.currentTime / trailer.duration) *  100;
        TrailerProgressBar.style.width = `${percent}%`;
        TrailerProgressBar.style.background = 'linear-gradient(to right, orange, pink, cyan)';
    })


    muteTrailer.onclick = function () {
        isTrailerMuted = !isTrailerMuted;
        muteTrailer.innerHTML = isTrailerMuted ? '&#128263;': '&#128264;'
        trailer.muted = isTrailerMuted;
        trailerMessage.textContent =  isTrailerMuted ? 'Video is muted' : 'Enjoy!';

        if(!isTrailerMuted) {
            setTimeout(() => {
                trailerMessage.textContent = '';
            },3000);
        }   
    }

    // Observer for pausing the video when it is not in the viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If the video is in the viewport, keep playing
                if (!isPlayingTrailer) {
                    trailer.play();
                    playTrailerBtn.innerHTML = '&#10074;&#10074;';
                    isPlayingTrailer = true;
                    trailer.muted = true;
                    isTrailerMuted = true;
                    trailerMessage.textContent =  isTrailerMuted ? 'Video is muted' : 'Enjoy!';
                    muteTrailer.innerHTML = isTrailerMuted ? '&#128263;': '&#128264;'
                }
            } else {
                // If the video is out of the viewport, pause it
                if (isPlayingTrailer) {
                    trailer.pause();
                    playTrailerBtn.innerHTML = '&#9654;';
                    isPlayingTrailer = false;
                }
            }
        });
    }, { threshold: 0.5 }); // 50% of the video should be in the viewport to trigger

    observer.observe(trailer); // Start observing the video

    function myFavSong() {
        const favSongs = [
            { song: "Charm - Vivian ft. Jose Chameleone", album: "Bongo" },
            { song: "Loved By You", album: "Airwave Music" },
            { song: "Blue Danube Waltz", album: "Classical" },
            { song: "JLS - Love You More", album: "RnB" },
            { song: "The Greatest Showman Cast - Tightrope", album: "Twilight" },
            { song: "Sing Me to Sleep", album: "Chills" },
            { song: "Groban - You'll Raise me Up", album: "Others" },
            { song: "Dil Mera Blast", album: "Bollywood" },
            { song: "Slow", album: "Ncs" },
            { song: "Céline Dion - I Drove All Night", album: "Celine Dion" },
            { song: "Hans Zimmer - Reunion (Love Found Us)", album: "Cool" },
            { song: "Breathe", album: "Two Steps From Hell" },
            { song: "Can I Have This Dance", album: "Disney" }
        ];
    
        const favArray = favSongs
            .map(fav => allSongArray.find(s => s.songName === fav.song && s.songGenre === fav.album))
            .filter(Boolean); // Filter out undefined values if a match isn't found
        
        const randomList = shuffleArray(favArray);
        createFavList(randomList);
    }
    

    function createFavList(arr) {
        const favContainer = document.querySelector('.fav-list');
        const container = favContainer.querySelector('.fav-list ul');

        arr.forEach(song => {
            const favLiElement = document.createElement('li');
            const assumedImg = myAlbums.find(al => al.albumName === song.songGenre);
            favLiElement.innerHTML = ` 
            <div class="image">
                <img src="${assumedImg ? assumedImg.albumImage : './logo.jpg'}" alt="favourite_song_image">
            </div>
            <div class="song-name">
                <h3>${song.songKeyWord}</h3>
            </div>`;

            container.appendChild(favLiElement);

            favLiElement.onclick = function () {
                playSongsAsCurrentSong(song)
            }
        });

        favContainer.style.display = 'block';

    }

})

//-------------------------------------------------------------------------------------------------------------------------


