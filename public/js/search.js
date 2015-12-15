(function() {

    function shuffle(o){
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

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
            
            $.getJSON('/api/search/topic/' + queryTerm)
            //$.getJSON('/api/search/topic/' + queryTerm)
                .success(function(data, status, xhr) {

                iconSets.toggleClass('d-n');
                var topic = queryTerm;
                var events = [];
                // kill events without lat/lon
                data.forEach(function(d) {
                    if (d && d.geo && !isNaN(d.geo.latitude) && !isNaN(d.geo.longtitude)) {
                        events.push(d);
                    }
                });
                // safety catch...
                var LIM = 100;
                events = shuffle(events).slice(0, LIM);
                // dispatch to timeline
                document.dispatchEvent(new CustomEvent(
                    'initiate_events',
                    { 'detail': { es: events } }
                ));
                //document.dispatchEvent(new CustomEvent(
                    //'leak_events',
                    //{ 'detail': { es: events}  }
                //));
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
