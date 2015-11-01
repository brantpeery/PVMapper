# Since CodePlex doesn't seem to play nice with AppHarbor anymore, here's a script to deploy from a tar.gz file out to AppHarbor
# Note that you'll need to replace "TODO-Add-AppHarbor-Build-Auth-Token" with the AppHarbor build token.
# Don't commit that token to the repo; doing so would expose the site to a gaping vulnerability.
$body = '{
   "branches": {
      "default": {
         "commit_id": "75991",
         "commit_message": "Merging from Dev to Release",
         "download_url": "http://dl.dropboxusercontent.com/u/85362/pvmapper-75991.tar.gz"
      }
   }
}'
$response = invoke-webrequest -uri "https://appharbor.com:443/applications/pvmapper/builds?authorization=TODO-Add-AppHarbor-Build-Auth-Token" -ContentType "application/json" -Method POST -Body $body
$response
