document.getElementById('entry-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const code = document.getElementById('code').value;

    fetch('validate_ticket.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
    })
    .then(response => response.json())
    .then(data => {
        const resultDiv = document.getElementById('entry-result');
        if (data.success) {
            resultDiv.innerHTML = `
                <p class="success-message">${data.message}</p>
                ${data.name ? `<p>Welcome, <strong>${data.name}</strong>!</p>` : ''}
            `;
        } else {
            resultDiv.innerHTML = `<p class="error-message">${data.message}</p>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});