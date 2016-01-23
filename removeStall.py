import sys
from collections import Counter

masterFile = open(sys.argv[2], "w")
lastLatLong = ""

inFile = open(sys.argv[1])
line = inFile.readline()
masterFile.write(line)
line = inFile.readline()
while line:
   spl = line.strip().split(",")
   latLong = "%s,%s" % (spl[3],spl[4])
   if latLong != lastLatLong:
       masterFile.write(line)
       lastLatLong = latLong
   line = inFile.readline() 
    
