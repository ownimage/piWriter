# PiWriter
This project is to enable a Raspberry Pi Zero W to control a large (144) NeoPixel array to 
display one or more images in sequence so that they can be recorded on a long exposure light-trail 

At the moment the project is structured into 3 directories
1) editor - this is the Angular app that allows a device (e.g. phone) to edit the playlists and change the images that the piWriter displays
2) server - this is the component that serves and recieves playlists and also drives the NeoPixelArray
3) library - this is the home for the images (.jpg or .json) an the playlists

#Build a release
This assumes that you are building a release on a PC/other machine for use on the Raspberry Pi.

What the build process does is compile the angular applicaiton in the `editor` folder, 
then compile the `.ts` files in the `src` directory to `.js` files in the `dist` directory.

It also assumes that you have `ts-node` and `typescript` installed.

##build editor
From the project root direcory ...
```
cd editor 
```
If building for the PC and serverEmulator ...
```
ng build
```
If building for the RaspberryPi
```
ng build --prod
```
##build serverCommon
From the project root directory ...
```
cd serverCommon
tsc src/*.ts
```
##build serverEmulator
From the project root directory ...
```
cd serverCommon
tsc src/*.ts
```
##build serverRPi
As there isn't any real code here (only the insertion of the native library), 
this will be left in javascript.
