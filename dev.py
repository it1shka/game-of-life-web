#!/usr/bin/env python3
from subprocess import Popen

commands = [
    'nodemon --ext "js" --exec "npm start" --signal SIGTERM',
    'sass --watch --no-source-map styles/styles.scss:assets/styles.css',
    'nodemon --ext "ts" --watch client --exec "tsc"'
]

processes = [Popen(c, shell=True) for c in commands]
for proc in processes: proc.wait()