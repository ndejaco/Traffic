import csv
import sys

if len(sys.argv) != 2:
    print("Usage: %s maxGap" % sys.argv[0])

fields = None
csvFile = sys.stdin
reader = csv.reader(csvFile)
count = 0
lastrow = None
rows = []
watchout = -1
for idx, row in enumerate(reader):
    if idx == 0:
        fields = row
        print(",".join(row))
    elif idx == 1:
        rows.append(row)
        lastrow = row
    else:
        unixtime = fields.index("unixtime")
        tid = fields.index("TripID")
        if row[tid] == watchout:
            lastrow = row
            pass
        if (lastrow[tid] == row[tid]):
            if int(row[unixtime]) - int(lastrow[unixtime]) <= int(sys.argv[1]):
                rows.append(row)
                lastrow = row
            else:
                print("%s:%d" % (row[tid],
                      int(row[unixtime])-int(lastrow[unixtime])), file=sys.stderr)
                while rows[-1][tid] == row[tid]:
                    rows.pop()
                watchout = row[tid]
                lastrow = row
        else:
            lastrow = row

for r in rows:
    print(",".join(r))
