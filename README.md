# httpbak
A really simple service for dumping data into files.

### Database Backups
Just run `mysqldump -p alles_core | curl https://yourserver.tld -d @-`, or schedule cron jobs, and it will create a backup of your mySQL database and use curl to post it to the server.