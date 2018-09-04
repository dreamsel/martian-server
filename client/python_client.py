#!/usr/bin/env python

import json
import time
import sys

#f = open("python.log", "w")
while True:
    #inputStr = inputCommand = raw_input()
    #f.write(inputStr+'\n')
    str = json.dumps([{'rover_id': 1, 'action_type': 'move', 'dx': 1, 'dy': 0}])
#    f.write('send string\n')
#    f.write(str+'\n')
    sys.stdout.write(str)
    sys.stdout.flush()
    time.sleep(1)
