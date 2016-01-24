
echo "Computing Similarity between users"
python vectorizeUsers.py trajectory_all_9col.csv userSimilarities

echo "Formatting top $1 user connections"
python data2json.py $1 userSimilarities similarity.json
