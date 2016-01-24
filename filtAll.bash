python3 timeFilt.py 8000 2> py.log | python3 accuFilt.py 500 | python removeStall.py | python directFilt.py | cut -f1-4,8 -d, > tr_all_final1.csv
