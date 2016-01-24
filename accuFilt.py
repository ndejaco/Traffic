import csv
import sys

if len(sys.argv) != 2:
    print("Usage: %s maxAccu" % sys.argv[0])

fields = None
csvFile = sys.stdin
reader = csv.reader(csvFile)
count = 0
for idx, row in enumerate(reader):
    if idx == 0:
        fields = row
        print(",".join(row))
    else:
        if(int(row[fields.index("accuracy")]) <= int(sys.argv[1])):
            print(",".join(row))
