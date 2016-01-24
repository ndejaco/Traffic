from tsne import bh_sne
import sys
from numpy import array 

data = []
for i, line in enumerate(sys.stdin):
	coords = line.strip().split(',')
	try:
		data.append(array([float(x) for x in coords]))
	except e:
		print "Error: line", i
	if i % 100 == 0: sys.stderr.write(str(i) + '\n')
	
sys.stderr.write('loaded')
ndata = array(data)
sys.stderr.write('converted to np array')
x2 = bh_sne(ndata)
sys.stderr.write('tsne done')

for point in x2:
	print ','.join([str(x) for x in point])


