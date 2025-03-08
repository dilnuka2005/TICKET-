document.getElementById('ticket-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const nic = document.getElementById('nic').value;
    const contactType = document.getElementById('contact-type').value;
    const phone = contactType === 'phone' ? document.getElementById('phone').value : null;
    const email = contactType === 'email' ? document.getElementById('email').value : null;

    // Generate a unique code
    const code = generateCode();

    // Prepare data for Google Sheets
    const data = {
        name: name,
        nic: nic,
        phone: phone,
        email: email,
        code: code
    };

    // Send data to Google Sheets
    fetch(https://script.google.com/d/1zw6umM6PbmVyht1zo2CocGjx2b5wIC2NaN0aImY0DWngg1v_DKnjoiWP/edit?usp=sharing, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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
                    <p>Your ticket code is: <strong>${code}</strong></p>
                    <button id="copy-button">Copy Code</button>
                    <button id="download-png">Download as PNG</button>
                </div>
            `;

            // Add event listener for the copy button
            document.getElementById('copy-button').addEventListener('click', function() {
                navigator.clipboard.writeText(code).then(() => {
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
            resultDiv.innerHTML = `<p style="color: red;">Error saving data. Please try again.</p>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Function to generate a unique code
function generateCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

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
