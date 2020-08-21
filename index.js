(function () {
    console.log('yo I am so linked you will not believe it', $);

    var nextUrl;
    $("#more").hide();
    
    
    function handleResponse (data) {
        var data = data.albums || data.artists;
        console.log('our data new data value:', data);
       
        var html = '';
        var imgUrl = '/default.jpg';
        for (var i = 0; i < data.items.length; i++) {
            if (data.items[i].images.length > 0) {
                imgUrl = data.items[i].images[0].url;
            }
            
            html += "<div class=\"searchResult\"><p>"+ data.items[i].name + "</p><a href=\"" + data.items[i].external_urls.spotify + "\"><img src=\""+ imgUrl+ "\" class=\"kitty\"></a></div>";
        }
        $('#results-container').html(html);

        if (data.next != null) {
            console.log('there is more results to get');
            $("#more").show();
    
            nextUrl =
                data.next &&
                data.next.replace(
                    'https://api.spotify.com/v1/search',
                    'https://spicedify.herokuapp.com/spotify'
                );
        
        } else {
            $("#more").hide();
        }
    }

    $("#more").on("click", function() {
        $.ajax({
            url: nextUrl,
            method: 'GET',
            data: {
    
            },
            success: handleResponse 
        });
    });

    $('#submit-btn').on('click', function () {
        var userInput = $('input[name=user-input]').val();
        var albumOrArtist = $('select').val();

        $.ajax({
            url: 'https://spicedify.herokuapp.com/spotify',
            method: 'GET',
            data: {
                query: userInput,
                type: albumOrArtist,
            },
            success: handleResponse
        });
    });

    //insert ?scroll=infinite in browser
    //after the call to API and after we got the results, we figure out if we 're doing an infinite scroll
    //or displaying the more button
    if (location.search.indexOf("scroll=infinite")>0) {
    //do infinite scroll
        $(window).scrollTop();   //logs the distance we scrolled in px distance to the top of the doc
        $(window).height();      //logs the height of the browser window
        $(document).height();    //logs the height of the entire page including any potential scroll available
        //when height of the winsow plus the scroll top is equal to the documwnt height,the user has reached the bottom of the page
        //this is when we want to go to spotify and get the next data set
        //if the user has not reached the bottom of the page, call setTimeOut and pass the infiniteCheck function
    }

})();