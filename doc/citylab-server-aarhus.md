# Citylab server (Aarhus)


InfluxDB, Kapacitor, Telegraf and Chronograf are installed as
described in [Getting started with
Chronograf](https://docs.influxdata.com/chronograf/v1.4/introduction/getting-started/).

We use nginx to proxy requests to the various systems running in the
background, and therefore we run chronograf with a `basepath`:

```sh
$ grep ExecStart /etc/systemd/system/multi-user.target.wants/chronograf.service
ExecStart=/usr/bin/chronograf --host 0.0.0.0 --port 8888 --basepath /chronograf/ --prefix-routes -b /var/lib/chronograf/chronograf-v1.db -c /usr/share/chronograf/canned $CHRONOGRAF_OPTS
```

## The node app

We use [`pm2`](https://github.com/Unitech/pm2) to keep the node
process
([`app.js`](https://github.com/aakb/sensors/blob/master/app.js))
running.

## Nginx configuration

```
server {
	listen 80 default_server;
	listen [::]:80 default_server;
	server_name citylab.etek.dk;

	include /etc/nginx/snippets/letsencrypt.conf;

	location / {
		return 301 https://citylab.etek.dk$request_uri;
	}
}

server {
	server_name citylab.etek.dk;
	listen 443 ssl http2 default_server;
	listen [::]:443 ssl http2 default_server ipv6only=on;

	ssl_certificate /etc/letsencrypt/live/citylab.etek.dk/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/citylab.etek.dk/privkey.pem;
	ssl_trusted_certificate /etc/letsencrypt/live/citylab.etek.dk/fullchain.pem;
	include /etc/nginx/snippets/ssl.conf;

	location /chronograf/ {
		proxy_pass http://localhost:8888/chronograf/;
		proxy_ignore_client_abort on;
		proxy_set_header Host $host;

		auth_basic "Restricted Content";
		auth_basic_user_file /etc/nginx/.htpasswd;
	}

	location /query {
		proxy_pass http://localhost:8086/query;
		proxy_ignore_client_abort on;
		proxy_set_header Host $host;
	}

	location / {
		proxy_pass http://127.0.0.1:3000;
		proxy_ignore_client_abort on;
		proxy_set_header Host $host;
	}
}
```
