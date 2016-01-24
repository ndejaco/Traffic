import csv
import sys

if len(sys.argv) != 2:
    print("Usage: %s maxAccu" % sys.argv[0])

fields = None
csvFile = sys.stdin
reader = csv.reader(csvFile)
count = 0
watchout = -1
rows = []
for idx, row in enumerate(reader):
    if idx == 0:
        fields = row
        print(",".join(row))
    else:
        tid = fields.index("TripID")
        if row[tid] == watchout:
            pass
        if(int(row[fields.index("accuracy")]) <= int(sys.argv[1])):
            rows.append(row)
        else:
            #print(row[tid])
            while rows[-1][tid] == row[tid]:
                rows.pop()
            watchout = row[tid]

for r in rows:
    print(",".join(r))

