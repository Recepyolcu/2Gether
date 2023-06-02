export function getGeolocation(address) {
    const apiKey = import.meta.env.VITE_GOOGLE_GEO_API_KEY;
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  
    return fetch(geocodingUrl)
    .then(response => response.json())
    .then(data => {
        if (data.status === 'OK') {
            const location = data.results[0].geometry.location;
            const latitude = location.lat;
            const longitude = location.lng;
            const formattedAddress = data.results[0].formatted_address;

            return { latitude, longitude, formattedAddress };
        } else {
            throw new Error('Geocoding failed. Status: ' + data.status);
        }
    }).catch(error => {
        throw new Error('Error: ' + error);
    });

}