#!/bin/bash
pid=`ps -auxww | grep node | grep -v grep | grep -v sudo | grep -v PATH | awk '{print $2}'`
if [ 0$pid -eq 0 ]
then 
    echo server starting > /home/pi/crontab.log
    cd /home/pi/piWriter/serverRPi
    sudo sh -c 'PATH=$PATH:/home/pi/.nvm/versions/node/v9.9.0/bin/; node dist/server'
fi