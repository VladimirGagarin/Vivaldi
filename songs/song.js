document.addEventListener('DOMContentLoaded', function () {

    const isAlreadyAdded = [];
    let currentQuoteIndex = 0;
    let currentReader = null;
    let isFromMoods = false;
    let currentAudio = null;
    let currentItems = {
        audio: null,
        song: null,
    }

    let currentPlaylistIndex = 0;
    let isDisplaying = false;
    let currentPlayingPlaylist = [];
    let currentPlaylist = []; // Holds the current playlist in order
    let allSongnames = [];
    let  allArtNames = [];


    let allSongArray = []; // Use let instead of const
    const shuffledSongArray = [];
    const likedSongs = JSON.parse(localStorage.getItem("LikedSongs") || "[]");
    const listenedSongs = JSON.parse(localStorage.getItem("ListenedSongs") || "[]");
    const userplayList = JSON.parse(localStorage.getItem('UserPlaylist') || '[]');

    let currentMood = null;

    document.documentElement.scrollTop = 0;

    const  homeBtn = document.querySelectorAll('.header-spot button')[1];
    const searchBtn = document.querySelectorAll('.header-spot button')[0];
    const headerTitle = document.querySelector('.header-spot h2');

    homeBtn.disabled = true;

    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });
    
    document.addEventListener('keydown', function (e) {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.shiftKey && e.key === 'C') || (e.ctrlKey && e.shiftKey && e.key === 'J')) {
          e.preventDefault();
            showNotification('Not now for the moment.');
        }
    });
      

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

    const myMoods = [
        { mood: "Upbeat", description: "Energetic and lively songs, often with a fast tempo and positive energy.", reader:"cantabile/reader1.mp3" },
        { mood: "Happy", description: "Cheerful and light-hearted songs, designed to boost your spirits.", reader:"cantabile/reader2.mp3" },
        { mood: "Sad", description: "Songs that evoke sadness or melancholy feelings.", reader:"cantabile/reader3.mp3" },
        { mood: "Romantic", description: "Songs that convey love, affection, and romantic emotions.", reader:"cantabile/reader4.mp3" },
        { mood: "Motivational", description: "Songs that inspire and encourage action, often used for workouts or personal growth.", reader:"cantabile/reader5.mp3" },
        { mood: "Relaxing", description: "Calm, soothing songs that help with relaxation or stress relief.",reader:"cantabile/reader6.mp3" },
        { mood: "Angry", description: "Songs that express frustration, rage, or strong emotions.",reader:"cantabile/reader7.mp3" },
        { mood: "Mellow", description: "Smooth and gentle songs that create a laid-back atmosphere.",reader:"cantabile/reader8.mp3" },
        { mood: "Dreamy", description: "Songs with a soft, ethereal, or otherworldly vibe.",reader:"cantabile/reader9.mp3" },
        { mood: "Nostalgic", description: "Songs that evoke memories of the past, often bittersweet.",reader:"cantabile/reader10.mp3" },
        { mood: "Epic", description: "Grand, powerful songs often used in movie soundtracks or anthems.",reader:"cantabile/reader11.mp3" },
        { mood: "Chill", description: "Laid-back, easy-going songs, often associated with relaxing moments.",reader:"cantabile/reader12.mp3" },
        { mood: "Party", description: "High-energy songs for social gatherings, clubs, or celebrations.",reader:"cantabile/reader13.mp3" },
        { mood: "Melancholic", description: "Songs that reflect deep sadness or a reflective, sorrowful mood.",reader:"cantabile/reader14.mp3" },
        { mood: "Hopeful", description: "Songs that convey optimism, anticipation, or positive aspirations.",reader:"cantabile/reader15.mp3" },
        { mood: "Sentimental", description: "Songs that evoke deep emotions and affection, often tied to memories.",reader:"cantabile/reader16.mp3" },
        { mood: "Peaceful", description: "Calm and serene songs, perfect for unwinding and inner peace.",reader:"cantabile/reader17.mp3" },
        { mood: "Intense", description: "Songs that are dramatic and full of energy, creating a sense of urgency.",reader:"cantabile/reader18.mp3" },
        { mood: "Fun", description: "Light-hearted and playful songs, often associated with good times and laughter.",reader:"cantabile/reader19.mp3" },
        { mood: "Euphoric", description: "Songs that evoke intense joy or bliss, often with a dance or trance feel.",reader:"cantabile/reader20.mp3" }
    ];

    myMoods.forEach(m => console.log(m.mood));

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
                shuffledSongArray.push(...data);
                displaySchema();
                displayCurrentSongFromMainPage();
                
               
                allSongArray = shuffleArray(shuffledSongArray); // Now this is fine
                showNotification(`Songs total: ${allSongArray.length}`)
                
                const songsNorLikedOrListen = allSongArray.filter(song => 
                    !likedSongs.some(s => s.songName === song.songName)&&
                    !listenedSongs.some(s => s.songName === song.songName)
                );

                if(songsNorLikedOrListen.length > 0) {
                    const shuffledSongs = shuffleArray(songsNorLikedOrListen)
                    shuffledSongs.forEach(song => {
                        createElementsInMinorSongs(song);
                    })
                }
                else{
                    const shuffledArraySongs = shuffleArray(allSongArray)
                    shuffledArraySongs.forEach(createElementsInMinorSongs);
                }

                homeBtn.disabled = false;

                allSongnames = Array.isArray(allSongArray) && allSongArray.length > 0 
                ? allSongArray.map(song => song.songName) 
                : [];
        
                allArtNames = Array.isArray(allSongArray) && allSongArray.length > 0 
                    ? allSongArray
                        .map(song => [song.songArtist1 ?? 'Unknown Artist', song.songArtist2 ?? 'Unknown Artist'])
                        .flat()
                        .filter(artist => artist !== 'Unknown Artist') 
                    :[];
            })
            
            .catch((err) => {
                console.error("Error fetching songs:", err);
                //displayReloadPage();
            });
    })();

   
    

    function displaySchema() {
        // Fetch the song.json data
        fetch('../songs.json')
        .then(response => response.json())
        .then(songs => {
            songs.forEach(song => {
                // Prepare artists' data based on available information
                const artists = [];
                artists.push(song.songArtist1);
                if (song.songArtist2) {
                    artists.push(song.songArtist2); // Only if songArtist2 is not null
                }
    
                // Generate JSON-LD Schema for the song
                const songSchema = {
                    "@context": "http://schema.org",
                    "@type": "Song",
                    "name": song.songName,
                    "genre": song.songGenre,
                    "byArtist": artists.map(artist => ({
                        "@type": "MusicAlbum",
                        "name": artist,
                    })),
                    "keywords": song.songKeyWord,
                    "mood": song.songMood,
                };
    
                // Add the generated schema to the HTML document
                const script = document.createElement('script');
                script.type = 'application/ld+json';
                script.textContent = JSON.stringify(songSchema);
                document.head.appendChild(script);

                updateMetaTags(song)
            });
        })
        .catch(error => console.error('Error fetching song data:', error));
    };

    function createLiElements(container, text, action = () => {}, ...args) {
        if (!container || !(container instanceof HTMLElement)) {
            console.error("Invalid container provided.");
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


    function displayCurrentSongFromMainPage() {

        const songData = JSON.parse(localStorage.getItem('currentSong'));
        const songCategory = localStorage.getItem('songSource');
        const moodData = localStorage.getItem("currentMood");
        let countDown = 6;
        let displayInterval;
        if (songData) {
            isFromMoods = songCategory === "mood";
            showDetailsForCurrentSong(songData);
            const confirmationOverlay =   document.querySelector('.overlay-confirmation');
            if(confirmationOverlay) {
                confirmationOverlay.querySelector('h3').textContent = songData.songName + `- ${songData.songGenre}`;
                confirmationOverlay.querySelector('h4').textContent = countDown;
                confirmationOverlay.style.display = 'flex';

                setTimeout(() => {
                    displayInterval = setInterval(function() {
                        countDown--;
                        confirmationOverlay.querySelector('h4').textContent = `${countDown}`;
                        if(countDown === 0) {
                            clearInterval(displayInterval);
                            confirmationOverlay.style.display = 'none';
                            playThisSongAsCurrentSong(songData, isFromMoods);
                            const typeOfSongCategory = (songCategory === "mood") ? moodData : songData.songGenre;
                        
                            if(isFromMoods) {currentMood = moodData;}
                            displayRecommendation(songData, typeOfSongCategory, isFromMoods);
                    
                        }

                        if(countDown <= 3) {
                            confirmationOverlay.querySelectorAll('.confirmation-actions button')[1].style.display = "none";
                        }
                    },1000);
                }, 2000);

                confirmationOverlay.querySelectorAll('.confirmation-actions button')[0].onclick = function () {
                    confirmationOverlay.style.display = 'none';
                    playThisSongAsCurrentSong(songData, isFromMoods);
                    const typeOfSongCategory = (songCategory === "mood") ? moodData : songData.songGenre;
                   
                    if(isFromMoods) {currentMood = moodData;}
                    displayRecommendation(songData, typeOfSongCategory, isFromMoods);
                    clearInterval(displayInterval);
                }

                confirmationOverlay.querySelectorAll('.confirmation-actions button')[1].onclick = function () {
                    currentSongSection(0);
                    confirmationOverlay.style.display = 'none';
                    clearInterval(displayInterval);
                }
            }
  
            
        }

        else{
            showNotification("No songs available");
            getSongFromUrl();
        }
    }

    function getSongFromUrl() {
        // Get the song name from the URL query parameter
        const params = new URLSearchParams(window.location.search);
        const songName = params.get('song');
        let countDown = 6;
        let displayInterval;
    
        if (songName) {
            // Fetch song data (you can replace this with your logic to retrieve song details)
            const songData = fetchSongDataByName(songName);
            
            // Display song details
            showDetailsForCurrentSong(songData);
    
            const confirmationOverlay = document.querySelector('.overlay-confirmation');
            if (confirmationOverlay) {
                confirmationOverlay.querySelector('h3').textContent = `${songData.songName} - ${songData.songGenre}`;
                confirmationOverlay.querySelector('h4').textContent = countDown;
                confirmationOverlay.style.display = 'flex';
    
                // Countdown logic
                setTimeout(() => {
                    displayInterval = setInterval(() => {
                        countDown--;
                        confirmationOverlay.querySelector('h4').textContent = `${countDown}`;
                        if (countDown === 0) {
                            clearInterval(displayInterval);
                            confirmationOverlay.style.display = 'none';
                            playThisSongAsCurrentSong(songData, false);
                            displayRecommendation(songData, songData.songGenre, false);
                        }
    
                        if (countDown <= 3) {
                            confirmationOverlay.querySelectorAll('.confirmation-actions button')[1].style.display = "none";
                        }
                    }, 1000);
                }, 2000);
    
                // User accepts song
                confirmationOverlay.querySelectorAll('.confirmation-actions button')[0].onclick = function () {
                    confirmationOverlay.style.display = 'none';
                    playThisSongAsCurrentSong(songData, false);
                    displayRecommendation(songData, songData.songGenre, false);
                    clearInterval(displayInterval);
                };
    
                // User cancels song
                confirmationOverlay.querySelectorAll('.confirmation-actions button')[1].onclick = function () {
                    currentSongSection(0);
                    confirmationOverlay.style.display = 'none';
                    clearInterval(displayInterval);
                };
            }
        }
        else{
            
            redirectToDefaultPage();
        }
       
    }

    function redirectToDefaultPage() {
        window.location.href = '../index.html';
    }

    function updateMetaTags(song) {
        // Update the title of the page
        const titleTag = document.querySelector('title');
        if (titleTag) {
            titleTag.textContent = `${song.songName} - ${song.songArtist1 || song.songArtist2}`;
        }

        // Update the meta description tag
        let descriptionMetaTag = document.querySelector('meta[name="description"]');
        if (!descriptionMetaTag) {
            descriptionMetaTag = document.createElement('meta');
            descriptionMetaTag.setAttribute('name', 'description');
            document.head.appendChild(descriptionMetaTag);
        }
        descriptionMetaTag.setAttribute('content', `${song.songName} by ${song.songArtist1 || song.songArtist2}. Genre: ${song.songGenre}.`);

        // Update the meta keywords tag
        let keywordsMetaTag = document.querySelector('meta[name="keywords"]');
        if (!keywordsMetaTag) {
            keywordsMetaTag = document.createElement('meta');
            keywordsMetaTag.setAttribute('name', 'keywords');
            document.head.appendChild(keywordsMetaTag);
        }
        keywordsMetaTag.setAttribute('content', `${song.songName}, ${song.songGenre}, ${song.songArtist1 || song.songArtist2}`);
    }
    
    
    function fetchSongDataByName(songTitle) {
        // Ensure allSongArray is defined and is an array
        if (Array.isArray(allSongArray)) {
            // Search for the song by title
            const songExist = allSongArray.find(song => song.songName === songTitle);
            if (songExist) {
                return songExist;
            } else {
                console.warn(`Song with title "${songTitle}" not found in the array.`);
            }
        } else {
            console.error("allSongArray is not defined or not an array.");
        }
        return null; // Return null if song is not found or allSongArray is invalid
    }
    
    


    function showDetailsForCurrentSong(song) {
        const detailSectionName = document.querySelector('.detail-section .left-detail h2');
        const detailSectionArtist = document.querySelector('.detail-section .left-detail p');
    
        detailSectionArtist.textContent = '';
        detailSectionName.textContent = '';
        // Update the DOM with song data
        detailSectionName.textContent = song.songName;
        detailSectionArtist.textContent = `${song.songArtist1} ${song.songArtist2 ? `Featuring ${song.songArtist2}` : ''}`;
           
    }

    function createElementsInMinorSongs(song) {
           
        if (allSongArray.length === 0) {
            console.warn('All songs array is empty.');
            document.querySelector('.minor-songs').style.display = 'none';
            return;
        }
    
        const container = document.querySelector('main #Feed .minor-songs ul');
        const prefferedImage = myAlbums.find(album => album.albumName === song.songGenre)
        
        if (!container) {
            console.error('Minor songs container not found.');
            return;
        }
    
        const newLi = document.createElement('li');
        newLi.innerHTML = `
            <div class="song-title">
                <h3>${song.songName}</h3>
            </div>
            <div class="song-album-name">
                <h3>${song.songGenre}</h3>
            </div>
        `;

        // Make sure we have a matching album before setting the background
        if (prefferedImage) {
            newLi.style.backgroundImage = `url('${prefferedImage.albumImage}')`;

        } else {
            console.warn(`No album found for genre: ${song.songGenre}`);
            newLi.style.backgroundImage = `url('logo.jpg')`; // Optionally set a default image if no album is found
        }
    
        container.appendChild(newLi);

        newLi.onclick = function () {
            isCurrentSong(song, false);
            currentPlaylistIndex = Array.from(document.querySelectorAll('.playing-section .right-section ul li')).findIndex(li => li.textContent.includes(song.songKeyWord));
        }
    }

    function isCurrentSong(song, moodStatus){
        localStorage.setItem('currentSong', JSON.stringify(song));
        playThisSongAsCurrentSong(song,moodStatus);
        document.title = `${song.songKeyWord} - (Playing)`;
        if(!moodStatus) {displayRecommendation(song, song.songGenre, moodStatus);}
        else{
            const moodPresent = song.songMood.find(m => m === currentMood);
            displayRecommendation(song, moodPresent, moodStatus);
            
        }
        
        currentPlaylistIndex = Array.from(document.querySelectorAll('.playing-section .right-section ul li')).findIndex(li => li.textContent.includes(song.songKeyWord));
    }

    function shuffleArray(array) {
        const arrayTobeShuffled = array;
    
        for (let i = arrayTobeShuffled.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1)); // Correct random index
            [arrayTobeShuffled[i], arrayTobeShuffled[randomIndex]] = [arrayTobeShuffled[randomIndex], arrayTobeShuffled[i]]; // Swap elements
        }
    
        return arrayTobeShuffled;
    }

    function currentSongSection(index) {

        const FeedSection = document.querySelector('main #Feed');
        const SpotlightField = document.querySelector('main #spotlight');
        const SearchField = document.querySelector('main #SearchField');

        const allSongSection = [FeedSection, SpotlightField, SearchField];
       

        allSongSection.forEach(field => {
            field.style.display = 'none';
        });

        if (allSongSection[index]) {
            console.log(allSongSection[index]);
            allSongSection[index].style.display = 'flex';
        } else {
            console.error(`Section at index ${index} does not exist.`);
        }
    }

    // Check if the URL contains the fragment `#spotlight`
    if (window.location.hash === '#spotlight') {
        currentSongSection(1)
    } else {
        currentSongSection(0)
    }

    function playThisSongAsCurrentSong(song, moodStatus){
        const songInLocalStorage =  localStorage.getItem('currentSong');
        let isMuted = false;
        let isLoop = false;

        if (!songInLocalStorage || JSON.parse(songInLocalStorage).songName !== song.songName) {
            localStorage.setItem('currentSong', JSON.stringify(song));
        }

        currentSongSection(1);
        showDetailsForCurrentSong(song)

        let islayingCurrentSong = false;
        if(currentAudio && !currentAudio.paused) {
            currentAudio.pause();
        }

         currentAudio = new Audio(`../${song.songUrl}`);

        const playBtn = document.querySelectorAll('.playing-section .left-section .currentSong-preview .current-song-controls .controls .left-controls button')[1];
        const prevBtn = document.querySelectorAll('.playing-section .left-section .currentSong-preview .current-song-controls .controls .left-controls button')[0];
        const nextBtn = document.querySelectorAll('.playing-section .left-section .currentSong-preview .current-song-controls .controls .left-controls button')[2];
        const likeBtn = document.querySelectorAll('.playing-section .left-section .currentSong-preview .current-song-controls .controls .left-controls button')[3];
        const muteBtn = document.querySelectorAll('.playing-section .left-section .currentSong-preview .current-song-controls .controls .left-controls button')[4];
        const volInput = document.querySelector('.playing-section .left-section .currentSong-preview .current-song-controls .controls .left-controls .vol-slider input');
        const progressBar = document.querySelector('.playing-section .left-section .currentSong-preview .current-song-controls .progress-truck .progress-bar');
        const timeSpan = document.querySelector('.playing-section .left-section .currentSong-preview .current-song-controls .controls .right-controls span');
        const loopBtn  = document.querySelectorAll('.playing-section .left-section .currentSong-preview .current-song-controls .controls .right-controls button')[0];
        const progressTruck = progressBar.parentElement;

        let reloadInterval;
        let countReload = 10;

        currentAudio.play();
        currentAudio.muted = isMuted;
        muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        currentAudio.loop = isLoop;
        loopBtn.innerHTML = '<i class="fa-solid fa-repeat"></i>';
        islayingCurrentSong = true;
        playBtn.innerHTML = islayingCurrentSong ? '&#10074;&#10074;' : '&#9654;';
        document.title = `${song.songKeyWord} - (Playing)`;

        currentAudio.volume = volInput.value / 100;

        // Update volume as the slider changes
        volInput.oninput = function () {
            const volumeValue = volInput.value / 100; // Convert 0-100 to 0-1
            currentAudio.volume = volumeValue;
            currentAudio.muted = volumeValue === 0; // Automatically mute if volume is 0
                
            // Update mute button display based on volume
            if (volumeValue === 0) {
                muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'; // Mute icon (🔇)
            } else if (volumeValue > 0 && volumeValue <= 0.4) {
                muteBtn.innerHTML = '<i class="fa-solid fa-volume-low"></i>'; // Low volume icon
            } else {
                muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>'; // High volume icon
            }
        };
        

        // Handle mute/unmute button click
        muteBtn.onclick = function () {
            isMuted = !isMuted;
            currentAudio.muted = isMuted;

            if (isMuted) {
                muteBtn.innerHTML = '&#128264;'; // Mute icon
                volInput.value = 0;
            } else {
                muteBtn.innerHTML = '&#128263;'; // Unmute icon
                volInput.value = currentAudio.volume * 100; // Sync slider with current volume
            }
        };

        loopBtn.onclick = function() {
            isLoop = !isLoop;

            currentAudio.loop = isLoop;

            loopBtn.innerHTML = isLoop 
            ? '🔂' // Loop with "1" icon
            : '<i class="fa-solid fa-repeat"></i>'; // Regular loop icon        
        
        }
        currentAudio.addEventListener('timeupdate', function () {
            const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
            progressBar.style.width = `${percent}%`;

            timeSpan.textContent = `${formattedTime(currentAudio.currentTime)} / ${currentAudio.duration ? formattedTime(currentAudio.duration) : "00 : 00"}`;
        });

        currentAudio.addEventListener('pause', function () {
            document.title = "Songs | Vivaldi Cantabile";
        })

        currentAudio.addEventListener('playing', function () {
            document.title = `${song.songArtist1} - ${song.songKeyWord} - (Playing)`;
            const img = myAlbums.find(al => al.albumName === song.songGenre)
            showNotification(`${song.songArtist1} - ${song.songKeyWord} - (Playing)`,img.albumImage);
            timeSpan.textContent = '';
            clearInterval(reloadInterval);
        })

        currentAudio.addEventListener('ended', function () {
            islayingCurrentSong = false;
            progressBar.style.width = `0%`;
            document.title = "Songs | Vivaldi Cantabile";
            playBtn.innerHTML = islayingCurrentSong ? '&#10074;&#10074;' : '&#9654;';
            if(!isLoop) {
                playNextSongInPlayList("forward", moodStatus);
            }

            const isListenedAlready = listenedSongs.some(s => s.songName === song.songName);
            if(!isListenedAlready) {
                
                if (listenedSongs.length > 30) {
                    listenedSongs.shift();
                }

                listenedSongs.push(song);
                localStorage.setItem("ListenedSongs",JSON.stringify(listenedSongs));
            }
        });

        currentAudio.addEventListener('error', function () {
            playBtn.disabled = true;
            nextBtn.disabled = true;
            prevBtn.disabled = true;

            timeSpan.textContent = "page reload in 10 sec";

            setTimeout(function () {
                reloadInterval = setInterval(function() {
                    countReload--;
                    timeSpan.textContent = `Page reloads in ${countReload} sec`;
                    if(countReload  >= 0) {
                        clearInterval(reloadInterval);
                        window.location.reload();
                    }
                },1000);
            },5000);
        });

        currentAudio.addEventListener('waiting', function () {
            playBtn.disabled = true;
            nextBtn.disabled = true;
            prevBtn.disabled = true;
        });

        currentAudio.addEventListener('canplay', function () {
            playBtn.disabled = false;
            nextBtn.disabled = false;
            prevBtn.disabled = false;
            timeSpan.textContent = '';
            clearInterval(reloadInterval);
        });

        currentAudio.addEventListener('loadedmetadata', function () {
            playBtn.disabled = false;
            nextBtn.disabled = false;
            prevBtn.disabled = false;
            timeSpan.textContent = '';
            clearInterval(reloadInterval);
        });

        playBtn.onclick = function () {
            islayingCurrentSong = !islayingCurrentSong;
            
            playBtn.innerHTML = islayingCurrentSong ? '&#10074;&#10074;' : '&#9654;';

            if(islayingCurrentSong) {
                currentAudio.play();
            }
            else{
                currentAudio.pause();
            } 

         currentPlaylistIndex = Array.from(document.querySelectorAll('.playing-section .right-section ul li')).findIndex(li => li.textContent.includes(song.songKeyWord));
       }

       prevBtn.onclick = function () {
            currentPlaylistIndex = Array.from(document.querySelectorAll('.playing-section .right-section ul li')).findIndex(li => li.textContent.includes(song.songKeyWord));
            playNextSongInPlayList("backward", moodStatus);
        }
    
        nextBtn.onclick = function () {
            currentPlaylistIndex = Array.from(document.querySelectorAll('.playing-section .right-section ul li')).findIndex(li => li.textContent.includes(song.songKeyWord));
            playNextSongInPlayList("forward", moodStatus);
        }

        let isLiked = likedSongs.some(s => s.songName === song.songName);
        likeBtn.classList.toggle("liked", isLiked);
    
        likeBtn.onclick = function () {
            isLiked = !isLiked;
            if (isLiked) {
                const isAlreadyInLikedSong = likedSongs.some(s => s.songName === song.songName);
                if (!isAlreadyInLikedSong) {
                    likedSongs.push(song);
                    // Corrected the localStorage.setItem() to save the updated likedSongs array
                    localStorage.setItem("LikedSongs", JSON.stringify(likedSongs)); 
                }
            } else {
                const filteredSongs = likedSongs.filter(s => s.songName !== song.songName);
                // Corrected the localStorage.setItem() to save the filtered likedSongs array
                localStorage.setItem("LikedSongs", JSON.stringify(filteredSongs)); 
            }
            // Update the button class for the liked status
            likeBtn.classList.toggle("liked", isLiked);
        }
        
        progressTruck.onclick = function (event) {
            const width = this.clientWidth;
            const clickedX = event.offsetX;

            currentAudio.currentTime = (clickedX / width) * currentAudio.duration;
        }
      
        function formattedTime(currentAudio) {
            const min = Math.floor(currentAudio / 60);
            const sec = Math.floor(currentAudio % 60);

            const fmin = min < 10 ? `0${min}` : min;
            const fsec = sec < 10 ? `0${sec}` : sec;

            return `${fmin} : ${fsec}`;
        }  
   }

   function displayRecommendation(song, category, moodStatus) {
        const moodsttributedToCurrentSong = song.songMood;
        const shuffleMoodList = shuffleArray(moodsttributedToCurrentSong);
        const moodSection  = document.querySelector('.left-detail .list-of-moods');
        const containerForMoods = document.querySelector('.left-detail .list-of-moods ul');
        const typeOfCategory = myAlbums.find(al => al.albumName === category) || myMoods.find(m => m.mood === category);
        let isMood = false;
        if (typeOfCategory && myMoods.includes(typeOfCategory)) {
            isMood = true;
        }
        const moodFragment = document.createDocumentFragment();

        containerForMoods.innerHTML = '';

        shuffleMoodList.forEach(mood => {
            const newMoodElement = document.createElement('li');
            newMoodElement.textContent = mood;
            moodFragment.appendChild(newMoodElement);
            containerForMoods.appendChild(moodFragment);

            newMoodElement.onclick = function () {
                document.querySelector('.left-detail .list-of-moods ul').innerHTML = '';
                currentPlaylistIndex = Array.from(document.querySelectorAll('.playing-section .right-section ul li')).findIndex(li => li.textContent.includes(song.songKeyWord));

                currentMood = mood;
                localStorage.setItem('currentMood', mood);

                const songWithThatMood = allSongArray.filter(s => s.songMood.includes(currentMood));
                displayContentInPlaylistForMood (songWithThatMood[0], currentMood);
                isCurrentSong(songWithThatMood[0], true);
            }
        });

       const currentMoodElement = Array.from( containerForMoods.querySelectorAll('li')).find(li => li.textContent === category);

       if(currentMoodElement) {
            containerForMoods.querySelectorAll('li').forEach(li => li.classList.remove('active'));
            currentMoodElement.classList.add("active");
       }
        const imageAttributedtoCurrentSong = myAlbums.find(album => album.albumName === song.songGenre);

        moodSection.style.backgroundImage = `url(${imageAttributedtoCurrentSong.albumImage})`;

        if(!moodStatus) {
            displayContentInPlaylistForAlbum( song ,isMood, category);
        }
        else{
            displayContentInPlaylistForMood( song, category);
        }
        displayAlbumsNotinSong(song);

        currentPlaylistIndex = Array.from(document.querySelectorAll('.playing-section .right-section ul li')).findIndex(li => li.textContent.includes(song.songKeyWord));
   }

   function displayContentInPlaylistForAlbum(song, isMood, category) {
        const playlistContainer = document.querySelector('.playing-section .right-section ul');
        const playListTitle = document.querySelector('.playing-section .right-section h2');

        playlistContainer.innerHTML = '';

        const songsOfThatCategory = allSongArray.filter(song => {
            if (isMood) {
                // Filter songs by mood
                return song.songMood.some(mood => mood === category);
            } else {
                // Filter songs by album (or genre)
                return song.songGenre === category;
            }
        });

        if(songsOfThatCategory.length === 0) {
            alert("no songs to recommend to your playlist");
            return;
        }

        
        currentPlaylist = [...songsOfThatCategory];

         // Optionally move the current song to the top
        const filteredSongIndex = songsOfThatCategory.findIndex(s => s.songName === song.songName);
        if (filteredSongIndex > -1) {
            const [filteredSong] = songsOfThatCategory.splice(filteredSongIndex, 1); // Remove the song
            songsOfThatCategory.unshift(filteredSong); // Add it to the top
        }

        // Update playlist title
        playListTitle.textContent = `${category} (${filteredSongIndex + 1} / ${currentPlaylist.length})`;

        currentPlaylist.forEach((song, index) => {
            const newCategoryElement = document.createElement('li');
            newCategoryElement.textContent = `${index + 1}.${song.songKeyWord}`;   
            playlistContainer.appendChild(newCategoryElement);

            newCategoryElement.onclick = function () {
                const indexOfSong = Array.from(playlistContainer.querySelectorAll('li')).findIndex(li => li.textContent.includes(song.songKeyWord));
                if(indexOfSong > -1) {
                    console.log(indexOfSong)
                    currentPlaylistIndex = indexOfSong;
                }
                isCurrentSong(song,false);
            }
        });

        playlistContainer.querySelectorAll('li').forEach(li => {li.classList.remove('playing')});

        const liElementWithSong = Array.from(playlistContainer.querySelectorAll('li')).find(li => li.textContent.includes(song.songKeyWord));
        if(liElementWithSong) {
            liElementWithSong.classList.add('playing');
        }

        currentPlaylistIndex = Array.from(document.querySelectorAll('.playing-section .right-section ul li')).findIndex(li => li.textContent.includes(song.songKeyWord));
    }

    function  displayContentInPlaylistForMood (song, category) {
        const playlistContainer = document.querySelector('.playing-section .right-section ul');
        const playListTitle = document.querySelector('.playing-section .right-section h2');

        playlistContainer.innerHTML = '';
        console.log("category in mood" , category);
        const songsWithThatMood = allSongArray.filter(s => s.songMood.includes(category));

        if(songsWithThatMood.length === 0) {
            alert("Non songno musika del mood");
            return;
        }

        currentPlaylist = [...songsWithThatMood];

        console.log(currentPlaylist);

        const indexOfCurrentSong = songsWithThatMood.findIndex(s => s.songName === song.songName);

       

        // Update playlist title
        playListTitle.textContent = `${category} (${indexOfCurrentSong + 1} / ${currentPlaylist.length})`;

        currentPlaylist.forEach((song,index) => {
            const newCategoryElement = document.createElement('li');
            newCategoryElement.textContent = `${index + 1}.${song.songKeyWord}`;   
            playlistContainer.appendChild(newCategoryElement);

            newCategoryElement.onclick = function () {
                const indexOfSong = Array.from(playlistContainer.querySelectorAll('li')).findIndex(li => li.textContent.includes(song.songKeyWord));
                if(indexOfSong > -1) {
                    console.log(indexOfSong)
                    currentPlaylistIndex = indexOfSong;
                }
                isCurrentSong(song, true);
            }
        });

        playlistContainer.querySelectorAll('li').forEach(li => {li.classList.remove('playing')});

        const liElementWithSong = Array.from(playlistContainer.querySelectorAll('li')).find(li => li.textContent.includes(song.songKeyWord));
        if(liElementWithSong) {
            liElementWithSong.classList.add('playing');
        }

        currentPlaylistIndex = Array.from(document.querySelectorAll('.playing-section .right-section ul li')).findIndex(li => li.textContent.includes(song.songKeyWord));
        
    }

    function displayAlbumsNotinSong(song) {
        const albumContainer = document.querySelector('.detail-section .right-detail ul');
        const albumInsong = song.songGenre;
        const otherAlbums = myAlbums.filter(al => al.albumName !== albumInsong);
    
        // Clear the album container before adding new items
        albumContainer.innerHTML = '';
    
        if (otherAlbums.length > 0) {
            otherAlbums.forEach(album => {
                const newAlbumLi = document.createElement('li');
                newAlbumLi.textContent = album.albumName;
                albumContainer.appendChild(newAlbumLi);
    
                newAlbumLi.onclick = function () {
                    document.querySelector('.left-detail .list-of-moods ul').innerHTML = '';
                    currentPlaylistIndex = Array.from(document.querySelectorAll('.playing-section .right-section ul li')).findIndex(li => li.textContent.includes(song.songKeyWord));
    
                    const songsWithAlbum = allSongArray.filter(s => s.songGenre === album.albumName);
    
                    if (songsWithAlbum.length > 0) {
                        // Use the first song of the album to populate the playlist
                        displayContentInPlaylistForAlbum(songsWithAlbum[0], false, album.albumName);
                        isCurrentSong(songsWithAlbum[0], false); // Highlight the first song
                    } else {
                        alert(`No songs available in the album "${album.albumName}".`);
                    }
                };
            });
        } else {
            // If there are no other albums, show a message
            const noAlbumsLi = document.createElement('li');
            noAlbumsLi.textContent = "No other albums available.";
            albumContainer.appendChild(noAlbumsLi);
        }
    }
    

    function playNextSongInPlayList(direction, moodStatus) {
        // Get all the `li` elements in the playlist
        const allKeywordElements = document.querySelectorAll('.playing-section .right-section ul li');
    
         // Extract keywords (text content) from the `li` elements
        const playlistKeywords = Array.from(allKeywordElements).map(li => {
            // Remove the index and the dot from the `li` content
            return li.textContent.split('.').slice(1).join('.').trim();
        });

        console.log("Playlist Keywords:", playlistKeywords);
        // Filter songs in allSongArray that match the keywords in the playlist
        const playListArray = allSongArray.filter(song => playlistKeywords.includes(song.songKeyWord));

        if (playListArray.length === 0) {
            console.error("Playlist array is empty! Check if the keywords match songKeyWord.");
            return;
        }

        console.log("Filtered Playlist Array:", playListArray);
        // Calculate the next song index based on direction
        if (direction === "forward") {
            currentPlaylistIndex = (currentPlaylistIndex + 1) % playListArray.length;
        } else {
            currentPlaylistIndex = (currentPlaylistIndex - 1 + playListArray.length) % playListArray.length;
        }
        
    
        // Get the next song
        const nextSong = playListArray[currentPlaylistIndex];

        allKeywordElements.forEach(li => li.classList.remove('playing'));
        if (allKeywordElements[currentPlaylistIndex]) {
            allKeywordElements[currentPlaylistIndex].classList.add('playing');
        }
    
        console.log(`Playing next song: ${nextSong.songName}`);
        // Additional logic to actually play the song goes here
        isCurrentSong(nextSong, moodStatus);
    }
    
   
   function createListOfLikedSongs(song) {

        const container = document.querySelector('.liked-songs ul');

        createLiElements(container, song.songKeyWord, playSongsAsCurrentSong, song);
    }

    if (likedSongs.length > 0) {
        likedSongs.forEach(song => {
            createListOfLikedSongs(song);
        });
    }
    else{
        const likedEl = document.querySelector('.liked-songs');
        if(likedEl) {
            likedEl.style.display = 'none';
        }
    }


    function createListOfListenedSongs(song) {
        const container = document.querySelector('.listened-songs ul');

        createLiElements(container, song.songKeyWord, playSongsAsCurrentSong, song);
    }

    
    if (listenedSongs.length > 0) {
        listenedSongs.forEach(song => {
            createListOfListenedSongs(song);
        });
    }
    else{
        const listenedEl = document.querySelector('.listened-songs');
        if(listenedEl){
            listenedEl.style.display = 'none';
        }
    }


    function playSongsAsCurrentSong(song) {
        console.log(song);
        localStorage.setItem('currentSong', JSON.stringify(song));
        playThisSongAsCurrentSong(song, false);
        displayRecommendation(song, song.songGenre, false);
        
    }

    if(myMoods.length > 0) {
        const shuffledMoods = shuffleArray(myMoods);
        populateMoodsInSongsArea(shuffledMoods)
    }

    function populateMoodsInSongsArea(arr) {
        const container = document.querySelector('main #Feed .mood-display ul');
        console.log(container); // This should log the container element or null if not found

        if (container) {
            arr.forEach(m => {
                createLiElements(container, m.mood, displaySongOfCurrentMood, m.mood);
            });
        } else {
            console.error('The container was not found!');
        }
    }

    function displaySongOfCurrentMood(mood) {
        console.log(mood);
        const songsWithThatMood = allSongArray.filter(song => song.songMood.some(m => m === mood));
    
        if (songsWithThatMood.length === 0) {
            alert('There is no song');
            return;
        }
    
        const randomsongIndex = Math.floor(Math.random()* songsWithThatMood.length);
        const selectedSong = songsWithThatMood[randomsongIndex];

        localStorage.setItem('currentSong', JSON.stringify(selectedSong));
        localStorage.setItem('currentMood', mood);
        currentMood = mood;
        playThisSongAsCurrentSong(selectedSong, true);
        displayRecommendation(selectedSong, mood, true);
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
    
    homeBtn.onclick = function () {
        if(currentAudio && !currentAudio.paused){
            currentAudio.pause();
        }

        if (listenedSongs.length > 0) {
            listenedSongs.forEach(song => {
                document.querySelector('.listened-songs ul').innerHTML = '';
                createListOfListenedSongs(song);
            });
        }
        else{
            const listenedEl = document.querySelector('.listened-songs');
            if(listenedEl){
                listenedEl.style.display = 'none';
            }
        }

        if (likedSongs.length > 0) {
            document.querySelector('.liked-songs ul').innerHTML = '';
            likedSongs.forEach(song => {
                createListOfLikedSongs(song);
            });
        }
        else{
            const likedEl = document.querySelector('.liked-songs');
            if(likedEl) {
                likedEl.style.display = 'none';
            }
        }

        currentSongSection(0);
    }

    searchBtn.onclick = function () {
        currentSongSection(2);
        const shuffledList = shuffleArray(listenedSongs)
        displayResultOuPut(shuffledList);
    }

   


        document.querySelector('#SearchField .header-search input').oninput = function () {
            
            const newInput = this.value.trim().toLowerCase();
        
            if (!newInput) return; 
        
            if (allSongnames.some(chiamo => chiamo.toLowerCase().includes(newInput)) || allArtNames.some(artiste => artiste.toLowerCase().includes(newInput))) {
                const songWithAssumedInput = allSongArray.find(song => song.songName.toLowerCase().includes(newInput)) || allSongArray.find(song => 
                    song.songArtist1.toLowerCase().includes(newInput) || 
                    (song.songArtist2 && song.songArtist2.toLowerCase().includes(newInput))
                );
        
                if (songWithAssumedInput) {

                    const assumedAlbum = songWithAssumedInput.songGenre;
        
                    const songSameAlbum = allSongArray.filter(chason => chason.songGenre === assumedAlbum);
                    const reorderedSongs = [
                        songWithAssumedInput,
                        ...songSameAlbum.filter(song => song.songName !== songWithAssumedInput.songName)
                    ];
        
                    displayResultOuPut(reorderedSongs);
                }
            }
        };
    
    document.querySelectorAll('.header-search button')[1].onclick = function () {
       if(currentAudio) {
        currentSongSection(1);
       }
       else {
        currentSongSection(0);
       }
    }

    function displayResultOuPut(arr= []) {
        let newArray = [];
        const container = document.querySelector('#SearchField .result-field ul');
    
        container.innerHTML = '';
    
        // Determine the source of newArray
        if (arr.length === 0) {
            newArray = [...allSongArray];
        } else {
            newArray = [...arr];
        }
    
        // Restrict the array to a maximum of 20 items
        const limitedArray = newArray.slice(0, 20);

    
        // Render each item into the DOM
        limitedArray.forEach(item => {
            const liResults = document.createElement('li');
            const itemImg = myAlbums.find(al => al.albumName === item.songGenre);
    
            liResults.innerHTML = `
                <div class="image-content-output">
                    <img src="${itemImg ? itemImg.albumImage : "../logo.jpg"}" alt="result image">
                </div>
                <div class="song-name-content">
                    <h3>${item.songName}</h3>
                    <p>${item.songArtist1} ${item.songArtist2 ? `Featuring ${item.songArtist2}` : ''}</p>
                </div>
            `;

            liResults.onclick = function () {
                playSongsAsCurrentSong(item)
            }
    
            container.appendChild(liResults);
        });
    }
    
})