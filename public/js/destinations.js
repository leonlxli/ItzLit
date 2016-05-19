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