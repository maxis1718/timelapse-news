<html>
    {{> head }}
    <body>
        <div class="body-holder">
            <div class="wrap">
                {{> header }}
                <div class="container">
                    <div class="row">
                        <div class="col-md-12 text-center">
                            {{{ body }}}
                        </div>
                    </div>
                </div>
                {{> footer }}
            </div>
        </div>
    </body>
    {{> scripts }}
</html>
