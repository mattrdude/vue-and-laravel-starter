<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Laravel + Vue</title>
    @vite('resources/js/app.js')
</head>
<body>
<div id="app"></div>
<script>
    console.log("Blade is loading scripts…");
</script>

</body>
</html>
