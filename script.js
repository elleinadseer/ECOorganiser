document.getElementById('postcode').addEventListener('blur', function() {
    const postcode = this.value;

    // Example using Postcodes.io (for UK postcodes)
    fetch(`https://api.postcodes.io/postcodes/${postcode}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                document.getElementById('street').value = data.result.admin_ward;
                document.getElementById('city').value = data.result.parish;
                document.getElementById('state').value = data.result.region;
            } else {
                alert("Postcode not found.");
            }
        })
        .catch(error => {
            console.error('Error fetching address:', error);
        });
});