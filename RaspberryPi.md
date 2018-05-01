# RaspberryPi Instructions

## Assumptions

These instructions are for a Raspberry Pi Zero W.  It is important that there is the wireless option so that it can create a mobile hotspot in order that you can connect to it to control it with a mobile device.

It is also expected that you have an ethernet dongle and ethernet cable.  It makes it far easier to be able to set the Wireless hotspot of the Pi and be able to download software at the same time.  The ethernet adapter is not needed once the Raspberry Pi is set up.
 
It is expected that the projects home directory will be \home\pi\piWriter.If it varies from that then you will need to modify the instructions accordingly.

These instructions are written assuming that you are using the Debian Stretch Lite operating system.

It is assumed that you know how to access your Raspberry Pi using ssh (using Putty or other).

## Approach 

These instructions first get the Raspberry Pi working on your local WiFi network, using ssh.  
This means that you can connect to it from a PC to configure it 
(which is generally easier as the Raspberry Pi will not be running a windowing operating system 
it means that Google is on the same screen and keyboard as the terminal window).

It then does an operating system update to make sure that everything is at the latest version.  
I found I needed to do this to get the ethernet adapter to work.

Then the Raspberry Pi will be configured as an Access Point so that you can connect to it in the absence of local WiFi.    

# First step get the pi online and with ssh
From <https://retropie.org.uk/forum/topic/4260/unable-to-ssh-to-pi-zero-over-usb-ethernet-gadget/10>
 
`sudo raspi-config` then goto `Network Options` -> `WiFi` 

enter `SSID` and `Passphrase` of your local WiFi network.

Scroll down to interfacing options then select the `ssh` option
tab to `Finish` and press enter.

Check connectivity using `ping google.com`

# Update operating system to latest version
I found I needed to do this in order to get the ethernet adapter working.
```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get dist-upgrade
sudo rpi-update
```

# Configure PI as access point
From <https://www.raspberrypi.org/forums/viewtopic.php?t=210080> 
Connect to your Raspberry Pi using the ethernet cable.

Firstly install a couple of additional packages.
```
sudo apt-get install hostapd
sudo apt-get install dnsmasq
```
Both times, you’ll have to hit y to continue. hostapd is the package that lets us create a wireless hotspot using a Raspberry Pi, and dnsmasq is an easy-to-use DHCP and DNS server.

Note if this fails run `sudo apt update` again

We’re going to edit the programs’ configuration files in a moment, so let’s turn the programs off
before we start making changes:
```
sudo systemctl stop hostapd
sudo systemctl stop dnsmasq
```
From <https://thepi.io/how-to-use-your-raspberry-pi-as-a-wireless-access-point/> 

`sudo nano /etc/dhcpcd.conf` add the following lies to the end of `/etc/dhcpcd.conf`
```
interface wlan0
static ip_address=192.168.0.1/24
```
Save the file and exit nano.  Then we are going to back up one of the config files.
```
sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig
```
`sudo nano /etc/dnsmasq.conf` and enter 
```
interface=wlan0
  dhcp-range=192.168.0.2,192.168.0.30,255.255.255.0,24h
```

`sudo nano /etc/hostapd/hostapd.conf` and add the following lines.
```
interface=wlan0
hw_mode=g
channel=7
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
ssid=piWriter
wpa_passphrase=ILoveRaspberryPi
```
From <https://thepi.io/how-to-use-your-raspberry-pi-as-a-wireless-access-point/> 
`sudo vi /etc/default/hostapd` add the following under the `#DAEMON_CONF line 
```
DAEMON_CONF="/etc/hostapd/hostapd.conf"
```

From <https://thepi.io/how-to-use-your-raspberry-pi-as-a-wireless-access-point/> 

`sudo nano /etc/network/interfaces` this adds support for the ethernet connection.
```
# interfaces(5) file used by ifup(8) and ifdown(8)

# Please note that this file is written to be used with dhcpcd
# For static IP, consult /etc/dhcpcd.conf and 'man dhcpcd.conf'

# Include files from /etc/network/interfaces.d:
source-directory /etc/network/interfaces.d

auto lo
iface lo inet loopback

auto eth0
iface eth0 inet dhcp

allow-hotplug wlan0
iface wlan0 inet static
  address 192.168.0.1
  netmask 255.255.255.0
  network 192.168.0.0
```

Install nvm and node
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash

Logout and back in to get the profile set
nvm i v9.9.0


Install git
sudo apt-get install git

From <https://gist.github.com/derhuerst/1b15ff4652a867391f03> 

Clone piWriter
git clone https://github.com/ownimage/piWriter.git

Build piWriter
cd piWriter/serverCommon
npm i
cd ../serverRPi
npm i
cdpw ../serverEmulator
npm i



# Auto start of server

There are two pieces to this, firstly the server component is started when the Pi boots using rc.local, secondly if the server crashes there is a crontab that will attempt to restart it every minute.  Both of these call the `startServer.sh` in root directory of this distribution.

**Edit `rc.local`** 

`sudo nano /etc/rc.local` then add the following BEFORE exit 0

```/bin/bash /home/pi/piWriter/startServer.sh &```

**Edit crontab**
`crontab -l` then add

```
* * * * * /home/pi/piWriter/startServer.sh &
```


