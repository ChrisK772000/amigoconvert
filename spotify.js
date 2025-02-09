document.addEventListener('DOMContentLoaded', () => {
    const convertButton = document.getElementById('convertButton');
    const urlInput = document.getElementById('spotifyUrl');
    const resultDiv = document.getElementById('result');

    convertButton.addEventListener('click', convertToMp3);

    async function convertToMp3() {
        const spotifyUrl = urlInput.value;
        
        // Reset resultaat div
        resultDiv.style.display = 'none';
        resultDiv.className = '';

        // Valideer de URL
        if (!isValidSpotifyUrl(spotifyUrl)) {
            showError('Voer een geldige Spotify track URL in.');
            return;
        }

        // Toon laad status met spinner
        showLoading('Conversie gestart... Even geduld.');

        try {
            // Bereid de API call voor
            const apiUrl = `https://spotify-music-mp3-downloader-api.p.rapidapi.com/download?link=${encodeURIComponent(spotifyUrl)}`;
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '30959fad4amsh1c04bfa7b0509a0p109597jsnbd8a575ffad7',
                    'x-rapidapi-host': 'spotify-music-mp3-downloader-api.p.rapidapi.com'
                }
            };

            // Voer de API call uit
            const response = await fetch(apiUrl, options);
            const result = await response.json();

            // Controleer of de response succesvol is
            if (!result.success || result.data.error) {
                showError('Er ging iets mis bij het converteren. Probeer het opnieuw.');
                console.error(result.message);
                return;
            }

            // Controleer of er media beschikbaar is
            if (!result.data.medias || result.data.medias.length === 0) {
                showError('Geen audio beschikbaar voor deze track. Probeer een andere track.');
                return;
            }

            const downloadUrl = result.data.medias[0].url;
            const trackTitle = result.data.title;

            // Toon download link met track informatie
            showSuccess(`
                <p>Je MP3 is klaar voor download!</p>
                <p><small>Track: ${trackTitle}</small></p>
                <a href="${downloadUrl}" 
                   class="download-button" 
                   target="_blank" 
                   rel="noopener noreferrer">
                    Download MP3 (${result.data.medias[0].quality})
                </a>
            `);

        } catch (error) {
            showError('Er ging iets mis bij het converteren. Probeer het opnieuw.');
            console.error('Conversion error:', error);
        }
    }

    function isValidSpotifyUrl(url) {
        const spotifyRegex = /^(https?:\/\/)?(open\.)?spotify\.com\/track\/.+/;
        return spotifyRegex.test(url);
    }

    function showError(message) {
        resultDiv.innerHTML = message;
        resultDiv.className = 'error';
        resultDiv.style.display = 'block';
    }

    function showSuccess(message) {
        resultDiv.innerHTML = message;
        resultDiv.className = 'success';
        resultDiv.style.display = 'block';
    }

    function showLoading(message) {
        resultDiv.innerHTML = `
            <p>${message}</p>
            <div class="loader"></div>
        `;
        resultDiv.className = 'success';
        resultDiv.style.display = 'block';
    }

    // Extra: voeg Enter key support toe
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            convertToMp3();
        }
    });
});
