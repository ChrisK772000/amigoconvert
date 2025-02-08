document.addEventListener('DOMContentLoaded', () => {
    const convertButton = document.getElementById('convertButton');
    const urlInput = document.getElementById('youtubeUrl');
    const resultDiv = document.getElementById('result');

    convertButton.addEventListener('click', convertToMp3);

    async function convertToMp3() {
        const youtubeUrl = urlInput.value;
        
        // Reset resultaat div
        resultDiv.style.display = 'none';
        resultDiv.className = '';

        // Valideer de URL
        if (!isValidYouTubeUrl(youtubeUrl)) {
            showError('Voer een geldige YouTube URL in.');
            return;
        }

        // Toon laad status met spinner
        showLoading('Conversie gestart... Even geduld.');

        try {
            // Bereid de API call voor
            const apiUrl = `https://youtube-mp310.p.rapidapi.com/download/mp3?url=${encodeURIComponent(youtubeUrl)}`;
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '30959fad4amsh1c04bfa7b0509a0p109597jsnbd8a575ffad7',
                    'x-rapidapi-host': 'youtube-mp310.p.rapidapi.com'
                }
            };

            // Voer de API call uit
            const response = await fetch(apiUrl, options);
            const result = await response.json();

            if (result.error) {
                showError('Er ging iets mis bij het converteren. Probeer het opnieuw.');
                console.error(result.error);
                return;
            }

            // Controleer of downloadUrl beschikbaar is
            if (!result.downloadUrl) {
                showError('Geen download link beschikbaar. Probeer het opnieuw.');
                return;
            }

            // Toon download link
            showSuccess(`
                <p>Je MP3 is klaar voor download!</p>
                <a href="${result.downloadUrl}" 
                   class="download-button" 
                   target="_blank" 
                   rel="noopener noreferrer">
                    Download MP3
                </a>
            `);

        } catch (error) {
            showError('Er ging iets mis bij het converteren. Probeer het opnieuw.');
            console.error('Conversion error:', error);
        }
    }

    function isValidYouTubeUrl(url) {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        return youtubeRegex.test(url);
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
