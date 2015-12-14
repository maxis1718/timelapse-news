(function() {

    $(document).ready(function() {
        
        $('.search-btn').click(function(e) {
            
            var queryTerm = $('#search-input').val();
            
            $.ajax({
                url: '/api/search/topic/' + queryTerm
            }).success(function(data, status, xhr) {
                
                var response = JSON.parse(data);

                $.each(response.events, function(index, event) {
                    console.log(event);

                    newsMap.addEvent({
                        id: index,
                        lat: event.geo.latitude,
                        lng: event.geo.longtitude,
                        title: event.newsContent.title,
                        abstract: event.newsContent.abstract,
                        location: event.geo.location,
                        date: event.time.from
                        //img: not ready
                    });
                });
            });
        });

        $('#search-input').keypress(function(e) {
            if (e.which === 13) {
                $('.search-btn').click();
                return false;
            }
        });
    });

})();