import csv
import sys

if len(sys.argv) != 3:
    print("Usage: %s inputCSV maxAccu" % sys.argv[0])

fields = None
with open(sys.argv[1]) as csvFile:
    reader = csv.reader(csvFile)
    count = 0
    for idx, row in enumerate(reader):
        if idx == 0:
            fields = row
            print(",".join(row))
        else:
            if(int(row[fields.index("accuracy")]) <= int(sys.argv[2])):
                print(",".join(row))
