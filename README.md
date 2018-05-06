# PiWriter
This project is to enable a Raspberry Pi Zero W to control a large (144) NeoPixel array to 
display one or more images in sequence so that they can be recorded on a long exposure light-trail 

At the moment the project is structured into 3 directories
1) editor - this is the Angular app that allows a device (e.g. phone) to edit the playlists and change the images that the piWriter displays
2) server - this is the component that serves and recieves playlists and also drives the NeoPixelArray
3) library - this is the home for the images (.jpg or .json) an the playlists

##Setting up the build environment or Raspberry Pi
#Download the tools (GIT and node, ts-node)
Note that you will need to install `curl` too in order to get `nvm` 
(node version manager, which is an easier way to manage node.
Login as pi
```
sudo apt-get update
sudo apt install -y git
sudo apt install -y curl
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
source ~/.bashrc
nvm i 9.9.0
nvm use 9.9.0
npm i -g ts-node@v6.0.1
npm i -g typescript@v2.8.3
npm i -g @types/node@10.0.2
```
Note that I am using node 9.9.0 atm as node 10 does not seem to allow the serverRPi to compile.

#Download the project
``` 
rm -rf piWriter
git clone https://github.com/ownimage/piWriter.git
```

#Post install steps 
```
cd piWriter/serverCommon
npm i
cd ../serverEmulator
npm i
```
If you want to see the output of the server
``` 
DEBUG=server*
export DEBUG
```
Run the Emulator
```
sudo sh -c 'PATH=$PATH:/home/pi/.nvm/versions/node/v9.9.0/bin/; ts-node src/server'
```
For the RaspberryPi do the following in addition
``` 
cd ../serverRPi
npm i
```
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
rm -r dist
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
rm -r dist
tsc ---outDir dist src/*.ts
```
##build serverEmulator
From the project root directory ...
```
cd serverCommon
rm -r dist
tsc ---outDir dist src/*.ts
```
##build serverRPi
As there isn't any real code here (only the insertion of the native library), 
this will be left in javascript.
