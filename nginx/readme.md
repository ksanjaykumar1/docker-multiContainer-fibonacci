
Nginx will watch for request from outside world  route to the appropirate i.e to react server (client) or express server (api).This helps abstraction of backend and preventing from hard coding the port number for the servers and managing them if we were to create  port mapping of client and api. 

rewrite /api/(.*)/$1 break;
we are adding this line to add "api" back to the request because when it goes through nginx it chops off "api"