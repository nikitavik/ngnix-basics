# Nginx Tutorial - Express Server Comparison

This project demonstrates how to serve static files using both Express.js and Nginx.

## Files Structure

```
nginx-tutorial/
├── index.html          # Main HTML page
├── server.js          # Express.js server
├── package.json       # Node.js dependencies
├── images/            # Static image assets
│   ├── cockroach_32x32px_scary_red_eyes_crawling__4613c0f0.png
│   ├── cockroach_32x32px_scary_red_eyes_crawling__49dcc6ca.png
│   ├── cockroach_32x32px_scary_red_eyes_crawling_brown_old__8465a13b.png
│   └── cockroach_32x32px_scary_red_eyes_crawling_brown_old_beard_humanlike__b04b4981.png
└── README.md          # This file
```

## Express Server Setup

### Installation

```bash
npm install
```

### Running the Server

```bash
npm start
# or
node server.js
```

The server will start on `http://localhost:3000` by default.

### What the Express Server Does

- **Serves static files**: All files in the current directory are accessible
- **Root route**: Serves `index.html` when you visit `/`
- **Static assets**: Images are served from `/images/` path
- **SPA fallback**: Any unknown routes serve `index.html` (useful for single-page apps)

## Nginx Configuration Comparison

To achieve similar functionality with Nginx, create a configuration like this:

```nginx
server {
    listen 80;
    server_name localhost;
    root /path/to/nginx-tutorial;
    index index.html;

    # Serve static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Key Differences

### Express.js
- ✅ Easy to set up and modify
- ✅ Great for development
- ✅ Built-in middleware support
- ❌ Less efficient for high-traffic static file serving
- ❌ More resource intensive

### Nginx
- ✅ Extremely efficient for static files
- ✅ Low memory footprint
- ✅ Excellent for production
- ❌ Configuration can be complex
- ❌ Less flexible for dynamic content

## Testing

Visit `http://localhost:3000` (or your Nginx server) to see the beautiful cockroach image gallery! 🦟

## Next Steps

- Compare response times between Express and Nginx
- Test with high concurrency
- Experiment with caching headers
- Try load balancing with multiple Nginx instances
