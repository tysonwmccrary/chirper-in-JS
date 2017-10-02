var $chirpButton = $('#chirp-btn');
var $chirpField = $('#chirp-field');
var $chirpList = $('#chirp-list');

$chirpField.on('input', function () {
    var isEmpty = $chirpField.val().length === 0;
    // if (isEmpty) {
    //     $chirpButton.prop('disabled', true);
    // } else {
    //     $chirpButton.prop('disabled', false);
    // }
    $chirpButton.prop('disabled', isEmpty);
});
$chirpButton.click(postChirp);

function postChirp() {
    var chirp = {
        message: $chirpField.val(),
        user: 'Tyson',
        timestamp: new Date().toISOString()
    };
    console.log(chirp);
    $.ajax({
        method: 'POST',
        url: '/api/chirps',
        contentType: 'application/json',
        data: JSON.stringify(chirp)
    }).then(function (success) {
        // successfully POST new data to the server
        $chirpField.val('');
        $chirpButton.prop('disabled', true);
        getChirps();
    }, function (error) {
        // an error occurred
        console.log(error);
    });
}

function getChirps() {
    $.ajax({
        method: 'GET',
        url: '/api/chirps'
    }).then(function (chirps) {
        //console.log(chirps);
        $chirpList.empty();
        for (var i = 0; i < chirps.length; i++) {
            var $chirpDiv = $('<div class="chirp"></div>');
            var $message = $('<p></p>');
            var $user = $('<h4></h4>');
            var $timestamp = $('<h5></h5>');

            $message.text(chirps[i].message);
            $user.text(chirps[i].user);
            $timestamp.text(new Date(chirps[i].timestamp).toLocaleString());

            $message.appendTo($chirpDiv);
            $user.appendTo($chirpDiv);
            $timestamp.appendTo($chirpDiv);

            $chirpDiv.appendTo($chirpList);
        }
    }, function (error) {
        console.log(error);
    });
}
getChirps();
