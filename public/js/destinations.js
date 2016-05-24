function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    var autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (document.getElementById('starting')), {
            types: ['geocode']
        });
    var autocomplete2 = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (document.getElementById('ending')), {
            types: ['geocode']
        });
    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    // autocomplete.addListener('place_changed', fillInAddress);
}

$('#destinations-form').submit(function(e) {
    e.preventDefault();
    var starting = $('#starting').val();
    var ending = $('#ending').val();
    window.location.href = '/maps?starting=' + starting + '&ending=' + ending;
});

//Getting starting location
$("#currLocation").click(function() {
    console.log("Getting location");
    getLocation();
    return false;
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    } else {
        alert('It seems like Geolocation, which is required for this page, is not enabled in your browser.');
    }
}

function successFunction(position) {
    var lati = position.coords.latitude;
    var long = position.coords.longitude;
    var latlng = lati + " , " + long;
    geoLocate(latlng);
}

function geoLocate(LATLNG) {
    var input = LATLNG;
    var latlngStr = input.split(',', 2);
    var latlng = {
        lat: parseFloat(latlngStr[0]),
        lng: parseFloat(latlngStr[1])
    };

    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({
        'location': latlng
    }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                //infowindow.setContent(results[1].formatted_address);
                $("#starting").text(results[0].formatted_address);
                $("#starting").val(results[0].formatted_address);
                console.log("Got location");
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}

function errorFunction(position) {
    alert("Couldn't get your location!");
}