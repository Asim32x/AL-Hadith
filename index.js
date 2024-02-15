const hadithElement = document.getElementById('hadis');
const newHadithButton = document.getElementById('newb');
const narratorElement = document.getElementById('narrator');
const soundIcon = document.querySelector('.sound');
const soundOffIcon = document.querySelector('.stop');

let isSpeaking = false;

function getUrduVoice() {
    const voices = window.speechSynthesis.getVoices();
    // Attempt to find an Urdu voice
    return voices.find(voice => voice.lang === 'ur-PK') || null;
}

async function fetchRandomHadith() {
    try {
        newHadithButton.innerHTML = 'Loading Hadith...';
        const response = await fetch('https://random-hadith-generator.vercel.app/bukhari/');
        const data = await response.json();
        hadithElement.innerHTML = data.data.hadith_english;
        narratorElement.innerText = data.data.header;
        newHadithButton.innerHTML = 'New Hadith';

        // Automatically start speech synthesis with the new Hadith
        startSpeechSynthesis(hadithElement.innerHTML);
    } catch (error) {
        console.error('Error fetching Hadith:', error);
        newHadithButton.innerHTML = 'Failed to load Hadith';
    }
}

function startSpeechSynthesis(text) {
    if (isSpeaking || window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    let speech = new SpeechSynthesisUtterance(text);
    const urduVoice = getUrduVoice();
    if (urduVoice) {
        speech.voice = urduVoice; // Use the Urdu voice if available
    } else {
        speech.lang = 'ur-PK'; // Attempt to use Urdu, but may default to system's primary language
    }
    speech.onend = () => {
        isSpeaking = false;
    };
    speech.onerror = () => {
        isSpeaking = false;
    };
    window.speechSynthesis.speak(speech);
    isSpeaking = true;
}

// This ensures voices are loaded before attempting to find an Urdu voice.
window.speechSynthesis.onvoiceschanged = () => {
    soundIcon.addEventListener('click', () => {
        if (!isSpeaking) {
            startSpeechSynthesis(hadithElement.innerHTML);
        }
    });
};

soundOffIcon.addEventListener('click', () => {
    if (isSpeaking || window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
    }
});

newHadithButton.addEventListener('click', fetchRandomHadith);
