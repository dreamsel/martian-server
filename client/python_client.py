#!/usr/bin/env python

import json
import time
import sys
import random

random.seed
#f = open("python.log", "w")
while True:
    inputStr = raw_input()
    try:
        playerMoveData = json.loads(inputStr)
    except ValueError:
        sys.stderr.write('failed to parse input')
        sys.stderr.flush()
    #f.write(inputStr+'\n')
    choice = random.randrange(8)
    if (choice > 3):
        choice = choice + 1
    dx = choice % 3 - 1
    dy = choice / 3 - 1
    str = json.dumps([{'rover_id': 1, 'action_type': 'move', 'dx': dx, 'dy': dy}])
#    f.write('send string\n')
#    f.write(str+'\n')
    sys.stdout.write(str + "\n")
    sys.stdout.flush()
    time.sleep(1)
