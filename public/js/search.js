(function() {

    $(document).ready(function() {
        
        $('.search-btn').click(function(e) {
            
            var queryTerm = $('#search-input').val();
            
            $.ajax({
                url: '/mock/search/topic/' + queryTerm
            }).success(function(data, status, xhr) {
                var response = JSON.parse(data);
                var topic = response.topic;
                var events = response.events;
                //
                newsMap.removeAllEvents();
                // dispatch to timeline
                var de = new CustomEvent('initiate_events', { 'detail': {
                    e: events
                }});
                if(document) document.dispatchEvent(de);
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
