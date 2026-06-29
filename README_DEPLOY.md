## Deployement BE

- setup AWS instance
- Backend
- install dependencies in devTinder directory
- allow e2cinstance public IP on mongoDB server
- npm install pm2 -g
- pm2 start npm -- start
- pm2 logs, pl2 lsit, pm2 flsuh <name>, pm2 stop <name>, pm2 delete <name>
- creating process with custom name -> pm2 start npm --name "devTinder-BE" -- start
- Enable port :7777 from AWS instance -> security -> security group
- To fix the mismatch domain we have to use nginx proxy-pass
- Get the config from internet "nginx proxy pass /api to 7777 node application"
- Edit the nginx config file -> sudo nano /etc/nginx/sites-available/default
- Chnage the server name to 13.53.124.61
- Then copy paste the below config

# New Node.js API Proxy block

    location /api/ {
        proxy_pass http://localhost:7777/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

- Save the file either by CTL + O the CTL + X or CTL + X the editor will ask: Save modified buffer?
- Restart the nginx -> sudo syatemctl restart nginx
- Edit the base Url in FE application and push code to github and pull from interface cmd
- Then again run the build command and copy code from devtinder/dist file to /var/www/html/
- sudo scp -r dist/\* /var/www/html/

## Seting email ciew AWS SES

- Login to Amazon console
- Go to IAM and create user (user deatils -> Set permissions select -> (Attach policies directly ->
  and in Permissions policies select(AmazonSESFullAccess ))) then Create user
- Select Amazon SES -> view setuppage
- Create identity with domain name , verify by domain name
- Select Verify Domain with "Easy DKIM" and DKIM signing key length as "RSA_1024_BIT" values and Create identity
- Setup DNS records in cloudeflare DNS records which are copied from AWS public DNS (with CNAME)
- Verify any email address with Amazon SES -> Identities
- Install aws-sdk v3
- Go to Amazon SES examples using SDK for JavaScript (v3) -> SendEmail
- Create a SESclient in utils add the code
- Create sesEmail in utils folder add the code
- Add code to send email when request is send
