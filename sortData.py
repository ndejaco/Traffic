import sys

inFile = open(sys.argv[1])
outFile = open(sys.argv[2], 'w')

outFile.write(inFile.readline())
lines = inFile.readlines()
lines = map(lambda x: x.split(","), lines)
print lines[1:3]
sortedLines = sorted(lines,key=lambda x: (int(x[0]),int(x[1]),int(x[8])))
for sortedLine in sortedLines: outFile.write(','.join(sortedLine))


