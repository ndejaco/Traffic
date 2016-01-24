import sys
import json

topN = int(sys.argv[1])
inFile = open(sys.argv[2])
outFile = open(sys.argv[3], 'w')

values = []

for i in inFile.readlines():
    values.append(eval(i))

nodes = []
output = {}
indexes = {}


for i in range(len(values)):
    indexes[values[i][1][1]] = i

x = 1
for i in values:
    temp = {}
    temp["name"] = i[0][1]
    temp["group"] = x
    x += 1
    nodes.append(temp)

links = []
for i in values:
    for j in i[:topN]:
        temp = {}
        temp["source"] = indexes[j[1]]
        temp["target"] = indexes[j[2]]
        temp["value"]  = j[0]
        links.append(temp)

output["nodes"] = nodes
output["links"] = links
outFile.write(json.dumps(output, sort_keys=True, indent=4,separators=(',',': ')))
