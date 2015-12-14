(function() {

    $(document).ready(function() {
        
        $('.search-btn').click(function(e) {
            var queryTerm = $('#search-input').val();
            
            $.get('/api/search/topic/' + queryTerm, function(data, status) {
                // TODO : render the data on map
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