## Deployement BE

- Update the base url to "/api"
- setup AWS instance
- Backend
  - install dependencies in devTinder directory
  - Create a .env file and push all the env variables : <nano .env>
  - Add EC2 instance public IP on mongoDB server network access list
  - Intall pm2 globally <npm install pm2 -g>
  - Start project via pm2 : <pm2 start npm -- start> or with custom name <pm2 start npm --name "devTinder-BE" -- start>
  - Some command for pm2: <pm2 logs>, <pm2 list>, <pm2 flsuh <name-of-server>>, <pm2 stop <name>>, <pm2 delete <name>>
  - creating process with custom name -> pm2 start npm --name "devTinder-BE" -- start
  - Enable port :7777 from AWS EC2 instance -> security -> security group
- To fix the mismatch domain we have to use nginx proxy-pass
- Get the config from internet "nginx proxy pass /api to 7777 node application"
- Edit the nginx config file: <sudo nano /etc/nginx/sites-available/default>
- Change the server_name to the public IP of the AWS instance
- Then copy paste the below server_name

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

- Save the config file either by CTL + O the CTL + X or CTL + X the editor will ask: Save modified buffer?
- Restart the nginx -> <sudo systemctl restart nginx>
- Edit the base Url in FE application and push code to github
- Pull code from github in aws interface cmd
- Then again run the build command and if any package is install run npm install in /devTinder directory
- Then start the server with pm2 restart <servername> || <serverNumber-from-the-list>
- To edit the env file in aws instance -> sudo nano .env
- To exit the env file editor -> CTL + X and then Y to save the changes
