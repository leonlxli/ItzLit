var getQueryString = function ( field, url ) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1] : null;
};

var start = getQueryString('starting').replace(/%20/g, " "),
    end   = getQueryString('ending').replace(/%20/g, " ");

    console.log(start);
    console.log(end);
    
setTimeout(function() {
  CreateDirections(start, end, "transit", function(res, err) {
      console.log(res)
  });
}, 1000);
