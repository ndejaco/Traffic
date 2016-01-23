import sys
from collections import Counter

if len(sys.argv) == 3:
	masterFile = open(sys.argv[2], "w")
	inFile = open(sys.argv[1])
elif len(sys.argv) == 1:
	masterFile = sys.stdin
	inFile = sys.stdout
else:
    print 'Error: give an input and output file as arguments'
    print '       or pipe in/out of this program'
    sys.exit(1)

lastLatLong = ""
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

