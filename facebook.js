document.addEventListener('DOMContentLoaded', () => {
    const convertButton = document.getElementById('convertButton');
    const urlInput = document.getElementById('facebookUrl');
    const resultDiv = document.getElementById('result');

    convertButton.addEventListener('click', downloadVideo);

    async function downloadVideo() {
        const facebookUrl = urlInput.value;
        
        // Reset resultaat div
        resultDiv.style.display = 'none';
        resultDiv.className = '';

        // Valideer de URL
        if (!isValidFacebookUrl(facebookUrl)) {
            showError('Voer een geldige Facebook video URL in.');
            return;
        }

        // Toon laad status met spinner
        showLoading('Video wordt verwerkt... Even geduld.');

        try {
            // Bereid de API call voor
            const apiUrl = `https://facebook-reel-and-video-downloader.p.rapidapi.com/app/main.php?url=${encodeURIComponent(facebookUrl)}`;
            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': '30959fad4amsh1c04bfa7b0509a0p109597jsnbd8a575ffad7',
                    'x-rapidapi-host': 'facebook-reel-and-video-downloader.p.rapidapi.com'
                }
            };

            // Voer de API call uit
            const response = await fetch(apiUrl, options);
            const result = await response.json();

            // Controleer of de high quality download URL beschikbaar is
            if (!result.links || !result.links['Download High Quality']) {
                showError('Geen video beschikbaar op deze URL. Probeer een andere video.');
                return;
            }

            const downloadUrl = result.links['Download High Quality'];

            // Toon download link met video titel
            showSuccess(`
                <p>Je video is klaar voor download!</p>
                ${result.title ? `<p><small>${result.title}</small></p>` : ''}
                <a href="${downloadUrl}" 
                   class="download-button" 
                   target="_blank" 
                   rel="noopener noreferrer">
                    Download Video (HD)
                </a>
            `);

        } catch (error) {
            showError('Er ging iets mis bij het verwerken. Probeer het opnieuw.');
            console.error('Conversion error:', error);
        }
    }

    function isValidFacebookUrl(url) {
        const facebookRegex = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+/;
        return facebookRegex.test(url);
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
            downloadVideo();
        }
    });
});
