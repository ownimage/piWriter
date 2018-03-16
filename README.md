# PiWriter
This project is to enable a Raspberry Pi Zero W to control a large (144) NeoPixel array to 
display one or more images in sequence so that they can be recorded on a long exposure light-trail 

At the moment the project is structured into 3 directories
1) editor - this is the Angular app that allows a device (e.g. phone) to edit the playlists and change the images that the piWriter displays
2) server - this is the component that serves and recieves playlists and also drives the NeoPixelArray
3) library - this is the home for the images (.jpg or .json) an the playlists
