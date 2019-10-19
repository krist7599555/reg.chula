MATCH=$(cat "${BASH_SOURCE%/*}/gened.txt" | grep -o "\d\{7\}")

for courseID in $MATCH; do
  echo $courseID
  curl "http://0.0.0.0:3000/api/courses/${courseID}?force"
done
