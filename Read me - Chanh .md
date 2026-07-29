1) Test API fetch reel

curl -X POST http://localhost:3000/api/reels/popular \
-H "Content-Type: application/json" \
-d '{
    "keyword":"restaurant"
}'