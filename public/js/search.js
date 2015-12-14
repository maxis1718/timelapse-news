(function() {

    $(document).ready(function() {
        
        $('.search-btn').click(function(e) {
            
            var queryTerm = $('#search-input').val();
            newsMap.removeAllEvents();
            document.dispatchEvent(new CustomEvent(
                'initiate_events',
                { 'detail': { e: [] } }
            ));
            
            $.ajax({
                url: '/mock/search/topic/' + queryTerm
            }).success(function(data, status, xhr) {
                var response = JSON.parse(data);
                var topic = response.topic;
                var events = response.events;
                // dispatch to timeline
                document.dispatchEvent(new CustomEvent(
                    'initiate_events',
                    { 'detail': { e: events } }
                ));
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
