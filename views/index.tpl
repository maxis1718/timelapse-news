<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="x-ua-compatible" content="ie=edge, chrome=1" />
        <title>Timelapse News</title>
        <link rel="stylesheet" type="text/css" href="css/timeline.css">
        <link rel="stylesheet" href="fonts/font.default.css?v1">
        <style type="text/css">
          html, body { height: 100%; margin: 0; padding: 0; }
          #map { height: 100%; }
        </style>
        <script src="js/timeline.js"></script>
    </head>
    <body>
        <div id="map" style="width:100%; height: 300px"></div>
        <div id="timeline" style="width: 100%; height: 400px"></div>

        <script async defer
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBV5ZcyMrGzXUdr8VUzo_lnqDLa24pCNF8&callback=initMap">
        </script>
        <script src="js/main.js"></script>
    </body>
</html>