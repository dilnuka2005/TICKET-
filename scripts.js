document.getElementById('contact-type').addEventListener('change', function() {
    const contactType = this.value;
    const contactInputContainer = document.getElementById('contact-input-container');

    if (contactType === 'phone') {
        contactInputContainer.innerHTML = `
            <label for="phone">Phone:</label>
            <input type="text" id="phone" name="phone" required>
        `;
    } else if (contactType === 'email') {
        contactInputContainer.innerHTML = `
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
        `;
    } else {
        contactInputContainer.innerHTML = ''; // Clear the container if no option is selected
    }
});

document.getElementById('ticket-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const nic = document.getElementById('nic').value;
    const contactType = document.getElementById('contact-type').value;
    const phone = contactType === 'phone' ? document.getElementById('phone').value : null;
    const email = contactType === 'email' ? document.getElementById('email').value : null;

    fetch('generate_ticket.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, nic, phone, email })
    })
    .then(response => response.json())
    .then(data => {
        const resultDiv = document.getElementById('ticket-result');
        if (data.success) {
            resultDiv.innerHTML = `
                <div id="ticket-details">
                    <p>Thank you, ${name}!</p>
                    <p><strong>NIC:</strong> ${nic}</p>
                    ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                    ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
                    <p>Your ticket code is: <strong>${data.code}</strong></p>
                    <button id="copy-button">Copy Code</button>
                    <button id="download-png">Download as PNG</button>
                </div>
            `;

            // Add event listener for the copy button
            document.getElementById('copy-button').addEventListener('click', function() {
                navigator.clipboard.writeText(data.code).then(() => {
                    alert('Ticket code copied to clipboard!');
                }).catch(() => {
                    alert('Failed to copy ticket code.');
                });
            });

            // Add event listener for the PNG download button
            document.getElementById('download-png').addEventListener('click', function() {
                downloadTicketAsPNG();
            });
        } else {
            resultDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Function to download ticket as PNG
function downloadTicketAsPNG() {
    const ticketDetails = document.getElementById('ticket-details');

    html2canvas(ticketDetails).then(canvas => {
        const link = document.createElement('a');
        link.download = `ticket.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}