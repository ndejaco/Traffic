import time
import sys

if len(sys.argv) is 2: 
   print time.strftime("%B %Y %H:%M:%S", time.localtime(float(sys.argv[1])))
else:
   print time.strftime(sys.argv[2], time.localtime(float(sys.argv[1])))
