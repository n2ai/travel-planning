npm install apify-client
npm install @google/genai

1) Test API fetch reel

curl -X POST http://localhost:3000/api/scrape-instagram \
-H "Content-Type: application/json" \
-d '{
    "keyword":"  "
}'

2) Test Api scrap reel.
curl -X POST http://localhost:3000/api/scrape
-reel   -H "Content-Type: application/json"   -d '{
    "reelUrl":""
  }'