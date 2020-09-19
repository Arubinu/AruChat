# AruChat (TextToSpeed)
Keep an ear on a Twitch stream chat !

Find the site without installation here: http://aruchat.pergens.fr

To access the current beta version, it's here: http://aruchat.pergens.fr/beta

![screenshot](/screenshot.png?raw=true "AruChat")

__This project uses different projects to operate__:
 - Native JavaScript for Bootstrap: https://github.com/thednp/bootstrap.native
 - Handlebars.js: https://github.com/handlebars-lang/handlebars.js
 - Font Awesome: https://github.com/FortAwesome/Font-Awesome
 - ComfyJS: https://github.com/instafluff/ComfyJS
 - NoSleep.js: https://github.com/richtr/NoSleep.js
 - Anchorme.js: https://github.com/alexcorvi/anchorme.js
 - flood-detector: https://github.com/dremixam/flood-detector
 - electron-builder: https://github.com/electron-userland/electron-builder

## Audio Output Redirection
To do this, you will need to change the audio output at each launch:
 - In the System Tray, right-click on the sound icon,
 - Select ___'Open Sound settings'___,
 - Then choose ___'App volume and device preferences'___,
 - Set the default output for AruChat if it is not already,
 - Finally choose the output you want.

Note that in the case of VoiceMeeter, you will need to ___'Restart Audio Engine'___ after this procedure (from the Menu button).
