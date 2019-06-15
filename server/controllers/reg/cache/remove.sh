for i in $(find ./logs); do
  cookie=$(cat $i)
  # echo "Cookie: ${cookie}"
  curl --silent 'https://www2.reg.chula.ac.th/servlet/com.dtm.chula.reg.servlet.LogOutServlet?language=T' -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -H 'Upgrade-Insecure-Requests: 1' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3' -H 'Referer: https://www2.reg.chula.ac.th/cu/reg/welcome/logout/LogOutFrame.jsp' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en,da;q=0.9,th;q=0.8' -H "Cookie: $cookie" --compressed >/dev/null
  echo $i
done
