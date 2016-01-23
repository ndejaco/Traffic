import sys

header = next(sys.stdin).strip()
print header

fields = header.split(',')
i1 = fields.index('UserID')
i2 = fields.index('TripID')
i3 = fields.index('unixtime')

def sorter(s): 
	x = s.strip().split(',')
	return (int(x[i1]), int(x[i2]), int(x[i3]))

for line in sorted(sys.stdin, key=sorter):
	print line.strip()
