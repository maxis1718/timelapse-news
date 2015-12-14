<html>
    {{> head }}
    <body>
        <div class="body-holder">
            <div id="wrapper">
                {{> header }}
                <div id="container">
                    <div class="row">
                        <div class="col-md-12">
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
