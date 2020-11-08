https://developer.atlassian.com/cloud/jira/platform/getting-started/

* start http-server with 
http-server -p 8000

* use ngrok to  make your local pages externaly available
ngrok http 8000

* adjust atlassian-connect.json with  the info of ngrok

* upload the app in jira by  using the  public url of atlassian-connect.json

* check the  baseUrl from atlassian-connect.json if installing the  app in Jira doens't  work.

