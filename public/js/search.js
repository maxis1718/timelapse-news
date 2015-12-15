(function() {

    $(document).ready(function() {
        
        $('.search-btn').click(function(e) {

            var iconSets = $(this).find('i');
            iconSets.toggleClass('d-n');
            
            var queryTerm = $('#search-input').val();
            newsMap.removeAllEvents();
            document.dispatchEvent(new CustomEvent(
                'initiate_events',
                { 'detail': { e: [] } }
            ));
            
            $.getJSON('/mock/search/topic/' + queryTerm)
                .success(function(data, status, xhr) {

                iconSets.toggleClass('d-n');
                var topic = queryTerm;
                var events = data.slice(0, 10);
                // dispatch to timeline
                document.dispatchEvent(new CustomEvent(
                    'initiate_events',
                    { 'detail': { es: events } }
                ));
                document.dispatchEvent(new CustomEvent(
                    'leak_events',
                    { 'detail': { es: events}  }
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
