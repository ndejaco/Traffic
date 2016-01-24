import csv
import sys

if len(sys.argv) != 1:
    print("Usage: %s" % sys.argv[0])
fields = None
csvFile = sys.stdin
reader = csv.reader(csvFile)
count = 0
tid = -1
dirct = 0
lastOmitRow = None
for idx, row in enumerate(reader):
    if idx == 0:
        print(",".join(row))
        fields = row
    else:
        index = fields.index("direction")
        if tid != row[1]:
            if (lastOmitRow):
                print(",".join(lastOmitRow))
                lastOmitRow = None
            tid = row[1]
            print(",".join(row))
            direct = row[index]
        elif direct != row[index]:
            if (lastOmitRow):
                print(",".join(lastOmitRow))
                lastOmitRow = None
            direct = row[index]
            print(",".join(row))
        else:
            lastOmitRow = row
