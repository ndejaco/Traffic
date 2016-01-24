import sys
from collections import *
import math

def vecLength(vec):
    return math.sqrt( sum ( [ vec[key] ** 2 for key in vec ] ) )

def featureVector(vec):
    length = vecLength(vec)
    return { key : float(vec[key]) / length for key in vec }

def cosDist(vec1, vec2):
    return sum( [ vec1.get(key, 0.0) * vec2.get(key,0.0) for key in vec1 ] )

def convertToFullMatrix(counts, valueDict):
    fullMat = [0.0] * len(valueDict)
    for item in counts:
        value = counts[item]
        index = valueDict[item]
        fullMat[valueDict[item]] += value
    return fullMat

def convertToValueDict(setOfItems):
    x = list(setOfItems)
    return { x[val] : val for val in xrange(len(x)) } 

inFile = open(sys.argv[1])
similarityFile = open(sys.argv[2], 'w')

header = inFile.readline().split(",")
line = inFile.readline()
uniqueVals = set()
users = defaultdict(Counter)

while line:
      spl = line.split(",")
      longLat = "%s,%s" % (spl[header.index('LocationLatitude')][:-3],spl[header.index('LocationLongitute')][:-3])
      uniqueVals.add(longLat)
      users[spl[0]][longLat] += 1
      line = inFile.readline()

for user in users:
       users[user] = featureVector(users[user]) 

valueDict = convertToValueDict(uniqueVals)

for user in users:
    similarityFile.write( str(sorted([(cosDist(users[user], users[other]), user, other) for other in users if other != user ] ,key = lambda x : x[0], reverse = True) ) + "\n" )
