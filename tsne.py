from tsne import bh_sne
import sys
import array from numpy

data = []
for line in sys.stdin:
	coords = line.strip().split(',')
	data.append(array([float(x) for x in coords]))
	
x2 = bh_sne(array(data))

for point in x2:
	print ','.join(point)


