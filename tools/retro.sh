#!/bin/sh
# Rende una base musicale "retrò" (mono, campionamento basso, 8 bit, filtrata), per le musiche private in local/.
#   sh tools/retro.sh "~/Downloads/cosasarà solo music.mp3" local/gianicolo.mp3
# Poi in local/songs.js:  SONGS.gianicolo = { file: 'local/gianicolo.mp3' };
in="$1"; out="$2"
ffmpeg -v error -y -i "$in" -ac 1 \
  -af "aresample=22050,acrusher=bits=8:mode=lin:aa=0.4:samples=2:mix=1,highpass=f=110,lowpass=f=4200,loudnorm=I=-16:TP=-1.5" \
  -ar 22050 -b:a 64k "$out"
