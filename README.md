# httpbak
A really simple service for dumping data into files. Data must be sent in base64.

### Database Backups
Just run `mysqldump -p alles_core | base64 | curl https://yourserver.tld -H "Authorization: secret" -d @-`, or schedule cron jobs, and it will create a backup of your mySQL database and use curl to post it to the server.