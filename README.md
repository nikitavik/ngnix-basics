# Nginx Tutorial - Load Balancing with SSL

This project demonstrates a containerized setup with Nginx as a reverse proxy and load balancer, distributing traffic across multiple Node.js application instances with SSL/TLS encryption.

## Architecture

- **Nginx**: Reverse proxy with SSL termination and load balancing
- **3x Node.js Apps**: Replicated Express.js servers
- **Docker Compose**: Orchestrates all services
- **Self-Signed SSL**: HTTPS encryption enabled

## Files Structure

```
nginx-tutorial/
├── index.html              # Main HTML page
├── server.js               # Express.js server
├── package.json            # Node.js dependencies
├── Dockerfile              # Node.js app container
├── Dockerfile.nginx        # Nginx container
├── docker-compose.yaml     # Multi-container orchestration
├── nginx.conf              # Nginx configuration (load balancing + SSL)
├── nginx-cert/            # SSL certificates
│   ├── openssl.bash        # Certificate generation script
│   ├── nginx-selfsigned.crt  # SSL certificate
│   └── nginx-selfsigned.key  # SSL private key
├── images/                # Static image assets
│   └── cockroach_*.png
└── README.md              # This file
```

## Quick Start

### Prerequisites

- Docker
- Docker Compose

### 1. Generate SSL Certificates (if not already generated)

```bash
cd nginx-cert
bash openssl.bash
```

### 2. Start All Services

```bash
docker-compose up -d
```

This will start:
- 3 Node.js application instances (app1, app2, app3)
- 1 Nginx reverse proxy with SSL

### 3. Access the Application

- **HTTPS (Recommended)**: https://localhost (port 443)
- **HTTP**: http://localhost (port 80)
- **HTTP Redirect**: http://localhost:8080 → redirects to HTTPS

### 4. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f nginx
docker-compose logs -f app1
```

### 5. Stop All Services

```bash
docker-compose down
```

## How It Works

### Load Balancing

Nginx distributes incoming requests across 3 Node.js instances using the **least_conn** algorithm:

```nginx
upstream nodejs_cluster {
    least_conn;
    server app1:3000;
    server app2:3000;
    server app3:3000;
}
```

### SSL/TLS Configuration

HTTPS is enabled on port 443 with self-signed certificates:

```nginx
server {
    listen 443 ssl;
    server_name localhost;

    ssl_certificate /etc/nginx/nginx-selfsigned.crt;
    ssl_certificate_key /etc/nginx/nginx-selfsigned.key;

    location / {
        proxy_pass http://nodejs_cluster;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### HTTP to HTTPS Redirect

Port 8080 redirects all traffic to HTTPS:

```nginx
server {
    listen 8080;
    server_name localhost;

    location / {
        return 301 https://$host$request_uri;
    }
}
```

## Features

### ✅ Load Balancing
- Distributes traffic across 3 Node.js instances
- Uses `least_conn` algorithm for optimal distribution
- Automatic failover if an instance goes down

### ✅ SSL/HTTPS
- Self-signed certificates for development
- HTTPS on port 443
- HTTP to HTTPS redirect on port 8080

### ✅ Containerization
- All services run in Docker containers
- Isolated network for secure communication
- Easy scaling and deployment

### ✅ Reverse Proxy
- Nginx handles SSL termination
- Forwards requests to backend apps
- Preserves original client information

## Testing Load Balancing

Each Node.js instance identifies itself in the console. Watch the logs to see requests distributed:

```bash
docker-compose logs -f app1 app2 app3
```

Refresh https://localhost multiple times to see different apps handling requests.

## Development

### Running Without Docker

```bash
# Install dependencies
npm install

# Run single instance
node server.js

# The app will be available at http://localhost:3000
```

### Regenerate SSL Certificates

```bash
cd nginx-cert
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx-selfsigned.key \
  -out nginx-selfsigned.crt \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
```

## Scaling

To add more Node.js instances, edit `docker-compose.yaml`:

```yaml
  app4:
    build: .
    environment:
      - APP_NAME=App4
    networks:
      - app-network
```

And update `nginx.conf`:

```nginx
upstream nodejs_cluster {
    least_conn;
    server app1:3000;
    server app2:3000;
    server app3:3000;
    server app4:3000;  # Add new instance
}
```

## Production Considerations

For production deployments:

1. **Use real SSL certificates** (Let's Encrypt, etc.)
2. **Enable HTTP/2** in nginx config
3. **Add rate limiting** to prevent abuse
4. **Configure proper logging** and monitoring
5. **Use environment variables** for sensitive data
6. **Set up health checks** for containers
7. **Implement proper security headers**

## Troubleshooting

### SSL Certificate Warning

Your browser will show a warning because the certificate is self-signed. This is expected for development. Click "Advanced" → "Proceed to localhost" to continue.

### Containers Won't Start

```bash
# Check if ports are already in use
sudo netstat -tulpn | grep -E ':(80|443|8080)'

# View error logs
docker-compose logs
```

### Rebuild After Changes

```bash
docker-compose down
docker-compose up --build -d
```
