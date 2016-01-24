
echo "Computing Similarity between users"
python vectorizeUsers.py ./tr_all_final1.csv userSimilarities

echo "Formatting top $1 user connections"
python data2json.py $1 userSimilarities similarity.json
