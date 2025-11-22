# Banner Text API

A powerful RESTful API service for generating customizable text banners in multiple formats (PNG images, HTML, and plain text). Built with AdonisJS and TypeScript, this service allows you to create, persist, and update text banners with extensive customization options.

> ⚠️ **WARNING: Early Development Stage**
>
> This project is currently in a **very early development stage** and should **NOT be used in production**. The API may have breaking changes, security vulnerabilities, incomplete features, or other issues. Use at your own risk and only for development/testing purposes.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Self-Hosting](#self-hosting)
- [Development](#development)
- [Docker Deployment](#docker-deployment)
- [Database](#database)
- [Contributing](#contributing)

## Features

- 🎨 **Multiple Output Formats**: Generate banners as PNG images, HTML, or plain text
- 💾 **Persistent Storage**: Save banners to a database with unique IDs and tokens
- 🔄 **Update Capability**: Modify existing banners using token-based authentication
- 🎯 **Extensive Customization**: Control text, colors, fonts, sizes, and alignment
- 🚀 **RESTful API**: Clean and intuitive API endpoints
- 🐳 **Docker Support**: Ready-to-deploy Docker container
- 📦 **TypeScript**: Fully typed codebase for better developer experience

## Technology Stack

- **Framework**: AdonisJS 6 (Node.js)
- **Language**: TypeScript
- **Database**: SQLite (better-sqlite3)
- **Image Generation**: Canvas (node-canvas)
- **Validation**: VineJS
- **ORM**: Lucid ORM

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher (24.7.0 recommended)
- **npm**: Version 9.x or higher
- **Docker** (optional, for containerized deployment)
- **System Dependencies** (for Canvas library):
  - On Ubuntu/Debian: `sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev`
  - On Alpine (Docker): Included in the base image

## Installation

### Local Development Setup

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd banner-text
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:

   ```env
   NODE_ENV=development
   PORT=3333
   APP_KEY=your-secret-app-key-here-minimum-32-characters
   HOST=0.0.0.0
   LOG_LEVEL=info
   URL=http://localhost:3333
   ```

   **Generate APP_KEY**:

   ```bash
   node ace generate:key
   ```

   Copy the generated key to your `.env` file.

4. **Run database migrations**:

   ```bash
   node ace migration:run
   ```

5. **Start the development server**:

   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3333` (or your configured PORT).

## Configuration

### Environment Variables

The following environment variables are required:

| Variable    | Type   | Description                               | Example                                                      |
| ----------- | ------ | ----------------------------------------- | ------------------------------------------------------------ |
| `NODE_ENV`  | enum   | Environment mode                          | `development`, `production`, `test`                          |
| `PORT`      | number | Server port                               | `3333`                                                       |
| `APP_KEY`   | string | Application encryption key (min 32 chars) | Generated via `node ace generate:key`                        |
| `HOST`      | string | Server hostname                           | `0.0.0.0` or `localhost`                                     |
| `LOG_LEVEL` | enum   | Logging level                             | `fatal`, `error`, `warn`, `info`, `debug`, `trace`, `silent` |
| `URL`       | string | Base URL for generated banner links       | `http://localhost:3333`                                      |

### Database Configuration

The application uses SQLite by default. The database file is stored at `tmp/db.sqlite3`. To use a different database:

1. Modify `config/database.ts`
2. Update connection settings
3. Install the appropriate database driver

## Usage

### Quick Start

1. **Create and persist a banner**:

   ```bash
   curl -X POST http://localhost:3333/banners/persist \
     -H "Content-Type: application/json" \
     -d '{
       "text": "Hello World",
       "color": "#FF5733",
       "backgroundColor": "#FFFFFF",
       "fontSize": 48,
       "width": 800,
       "height": 200
     }'
   ```

   Response:

   ```json
   {
     "id": "uuid-here",
     "options": { ... },
     "token": "random-token",
     "imageUrl": "http://localhost:3333/banners/image/uuid-here",
     "htmlUrl": "http://localhost:3333/banners/html/uuid-here",
     "textUrl": "http://localhost:3333/banners/text/uuid-here",
     "createdAt": "2024-01-01T00:00:00.000Z",
     "updatedAt": "2024-01-01T00:00:00.000Z"
   }
   ```

2. **Generate a banner image**:

   ```bash
   curl http://localhost:3333/banners/image/uuid-here > banner.png
   ```

3. **Update a banner**:
   ```bash
   curl -X PATCH http://localhost:3333/banners/uuid-here \
     -H "Content-Type: application/json" \
     -d '{
       "token": "your-token-here",
       "text": "Updated Text",
       "color": "#000000"
     }'
   ```

## API Documentation

### Base URL

All endpoints are relative to your configured `URL` environment variable.

### Endpoints

#### 1. Health Check

**GET** `/`

Returns a simple health check response.

**Response**:

```json
{
  "hello": "world"
}
```

---

#### 2. Create Banner (Image/HTML/Text)

**GET/POST** `/banners/:type`

**GET/POST** `/banners/:type/:id`

Generate a banner in the specified format without persisting to the database.

**Parameters**:

- `type` (path, required): Banner format - `image`, `html`, or `text`
- `id` (path, optional): Existing banner ID to use as base (merges options)

**Query/Body Parameters** (all optional):

- `text` (string): Banner text content
- `color` (string): Text color (CSS color value, e.g., `#FF5733` or `red`)
- `backgroundColor` (string): Background color (CSS color value)
- `fontSize` (number): Font size in pixels (default: 30)
- `fontFamily` (string): Font family name (default: `Arial`)
- `width` (number): Banner width in pixels (default: 1000)
- `height` (number): Banner height in pixels (default: 100)
- `textAlign` (enum): Horizontal alignment - `left`, `center`, `right` (default: `center`)
- `textVerticalAlign` (enum): Vertical alignment - `top`, `center`, `bottom` (default: `center`)

**Examples**:

```bash
# Generate PNG image
curl "http://localhost:3333/banners/image?text=Hello&color=blue&width=800&height=200" > banner.png

# Generate HTML
curl "http://localhost:3333/banners/html?text=Hello&backgroundColor=yellow" > banner.html

# Generate plain text
curl "http://localhost:3333/banners/text?text=Hello%20World"

# Use existing banner as base
curl "http://localhost:3333/banners/image/uuid-here?text=New%20Text"
```

**Response**:

- `image`: PNG image binary (Content-Type: `image/png`)
- `html`: HTML string (Content-Type: `text/html`)
- `text`: Plain text string (Content-Type: `text/plain`)

---

#### 3. Persist Banner

**GET/POST** `/banners/persist`

Create a banner and save it to the database. Returns banner metadata including URLs for all formats.

**Body Parameters** (all optional):

- Same as above banner creation parameters

**Example**:

```bash
curl -X POST http://localhost:3333/banners/persist \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Welcome",
    "color": "#333333",
    "backgroundColor": "#F0F0F0",
    "fontSize": 36,
    "fontFamily": "Arial",
    "width": 1200,
    "height": 300,
    "textAlign": "center",
    "textVerticalAlign": "center"
  }'
```

**Response**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "options": {
    "text": "Welcome",
    "color": "#333333",
    "backgroundColor": "#F0F0F0",
    "fontSize": 36,
    "fontFamily": "Arial",
    "width": 1200,
    "height": 300,
    "textAlign": "center",
    "textVerticalAlign": "center"
  },
  "token": "random-secure-token-string",
  "imageUrl": "http://localhost:3333/banners/image/550e8400-e29b-41d4-a716-446655440000",
  "htmlUrl": "http://localhost:3333/banners/html/550e8400-e29b-41d4-a716-446655440000",
  "textUrl": "http://localhost:3333/banners/text/550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

**Note**: Save the `token` value securely - it's required to update the banner later.

---

#### 4. Update Banner

**PATCH** `/banners/:id`

Update an existing banner. Requires the banner's token for authentication.

**Parameters**:

- `id` (path, required): Banner UUID

**Body Parameters**:

- `token` (string, required): Banner authentication token
- All other banner parameters (optional): Same as banner creation

**Example**:

```bash
curl -X PATCH http://localhost:3333/banners/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "token": "your-token-here",
    "text": "Updated Welcome Message",
    "color": "#000000",
    "fontSize": 48
  }'
```

**Response**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "options": {
    "text": "Updated Welcome Message",
    "color": "#000000",
    "backgroundColor": "#F0F0F0",
    "fontSize": 48,
    ...
  },
  "imageUrl": "http://localhost:3333/banners/image/550e8400-e29b-41d4-a716-446655440000",
  "htmlUrl": "http://localhost:3333/banners/html/550e8400-e29b-41d4-a716-446655440000",
  "textUrl": "http://localhost:3333/banners/text/550e8400-e29b-41d4-a716-446655440000",
  "updatedAt": "2024-01-01T12:30:00.000Z"
}
```

**Error Responses**:

- `404`: Banner not found
- `401`: Invalid or missing token

---

### Banner Options Reference

| Option              | Type   | Default    | Description                                     |
| ------------------- | ------ | ---------- | ----------------------------------------------- |
| `text`              | string | `""`       | The text content to display                     |
| `color`             | string | `"black"`  | Text color (CSS color)                          |
| `backgroundColor`   | string | `"white"`  | Background color (CSS color)                    |
| `fontSize`          | number | `30`       | Font size in pixels                             |
| `fontFamily`        | string | `"Arial"`  | Font family name                                |
| `width`             | number | `1000`     | Banner width in pixels                          |
| `height`            | number | `100`      | Banner height in pixels                         |
| `textAlign`         | enum   | `"center"` | Horizontal alignment: `left`, `center`, `right` |
| `textVerticalAlign` | enum   | `"center"` | Vertical alignment: `top`, `center`, `bottom`   |

### Color Formats

Colors can be specified in any CSS-compatible format:

- Hex: `#FF5733`, `#f00`
- RGB: `rgb(255, 87, 51)`
- RGBA: `rgba(255, 87, 51, 0.5)`
- Named colors: `red`, `blue`, `white`, etc.

## Self-Hosting

### Option 1: Docker Deployment (Recommended)

The easiest way to self-host is using Docker.

#### Prerequisites

- Docker installed
- Docker Compose (optional, for easier management)

#### Steps

1. **Build the Docker image**:

   ```bash
   docker build -t banner-text:latest .
   ```

2. **Create environment file** (`docker.env`):

   ```env
   NODE_ENV=production
   PORT=8080
   APP_KEY=your-generated-app-key-minimum-32-characters
   HOST=0.0.0.0
   LOG_LEVEL=info
   URL=http://your-domain.com
   ```

3. **Run the container**:

   ```bash
   docker run -d \
     --name banner-text \
     -p 8080:8080 \
     --env-file docker.env \
     -v banner-data:/app/tmp \
     banner-text:latest
   ```

   The `-v banner-data:/app/tmp` flag persists the SQLite database.

4. **Run database migrations** (first time only):
   ```bash
   docker exec banner-text node ace migration:run
   ```

#### Docker Compose Example

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  banner-text:
    build: .
    container_name: banner-text
    ports:
      - '8080:8080'
    environment:
      NODE_ENV: production
      PORT: 8080
      APP_KEY: ${APP_KEY}
      HOST: 0.0.0.0
      LOG_LEVEL: info
      URL: ${URL:-http://localhost:8080}
    volumes:
      - banner-data:/app/tmp
    restart: unless-stopped

volumes:
  banner-data:
```

Run with:

```bash
docker-compose up -d
```

---

### Option 2: Traditional Server Deployment

#### Prerequisites

- Node.js 18+ installed
- System dependencies for Canvas (see Prerequisites section)
- Process manager (PM2 recommended)

#### Steps

1. **Clone and install**:

   ```bash
   git clone <repository-url>
   cd banner-text
   npm ci --omit=dev
   ```

2. **Build the application**:

   ```bash
   npm run build
   ```

3. **Configure environment**:
   Create `.env` file with production settings:

   ```env
   NODE_ENV=production
   PORT=8080
   APP_KEY=your-secret-key
   HOST=0.0.0.0
   LOG_LEVEL=info
   URL=https://your-domain.com
   ```

4. **Run migrations**:

   ```bash
   node ace migration:run
   ```

5. **Start with PM2**:

   ```bash
   npm install -g pm2
   pm2 start bin/server.js --name banner-text
   pm2 save
   pm2 startup
   ```

6. **Set up reverse proxy** (Nginx example):

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:8080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

### Option 3: Cloud Platform Deployment

#### Vercel / Netlify / Railway

These platforms typically require minimal configuration:

1. Connect your repository
2. Set environment variables
3. Configure build command: `npm run build`
4. Configure start command: `npm start`
5. Set port: `8080`

**Note**: Ensure the platform supports:

- Node.js 18+
- Native dependencies (for Canvas)
- Persistent file storage (for SQLite) or configure external database

---

## Development

### Project Structure

```
banner-text/
├── app/
│   ├── controllers/     # Request handlers
│   ├── models/          # Database models
│   ├── services/        # Business logic
│   └── validators/      # Request validation
├── config/              # Configuration files
├── database/
│   └── migrations/      # Database migrations
├── start/               # Application startup files
├── public/              # Static assets
├── tests/               # Test files
└── bin/                 # Entry points
```

### Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm test`: Run tests
- `npm run lint`: Lint code
- `npm run format`: Format code with Prettier
- `npm run typecheck`: Type check without emitting files

### Database Migrations

```bash
# Run migrations
node ace migration:run

# Rollback last migration
node ace migration:rollback

# Create new migration
node ace make:migration migration_name
```

### Testing

```bash
# Run all tests
npm test

# Run specific test suite
node ace test --suite=unit
node ace test --suite=functional
```

## Docker Deployment

### Building the Image

The Dockerfile uses a multi-stage build for optimal image size:

```bash
docker build -t banner-text:latest .
```

### Image Details

- **Base Image**: `node:24.7.0-alpine3.22`
- **Exposed Port**: `8080`
- **Working Directory**: `/app`
- **Production Dependencies Only**: Dev dependencies excluded

### Volume Mounts

For persistent data storage:

```bash
docker run -v /path/to/data:/app/tmp banner-text:latest
```

This ensures the SQLite database persists across container restarts.

### Health Checks

Add a health check to your Docker configuration:

```yaml
healthcheck:
  test: ['CMD', 'wget', '--quiet', '--tries=1', '--spider', 'http://localhost:8080/']
  interval: 30s
  timeout: 10s
  retries: 3
```

## Database

### Schema

The `banners` table structure:

- `id` (UUID, Primary Key): Unique banner identifier
- `options` (JSON): Banner configuration options
- `token` (String, Unique): Authentication token for updates
- `created_at` (Timestamp): Creation timestamp
- `updated_at` (Timestamp): Last update timestamp

### Backup

To backup the SQLite database:

```bash
# Local
cp tmp/db.sqlite3 backup/db-$(date +%Y%m%d).sqlite3

# Docker
docker exec banner-text cp /app/tmp/db.sqlite3 /app/tmp/backup.sqlite3
docker cp banner-text:/app/tmp/backup.sqlite3 ./backup.sqlite3
```

### Migration to Different Database

To use PostgreSQL, MySQL, or other databases:

1. Install the appropriate Lucid driver
2. Update `config/database.ts`
3. Update connection settings
4. Run migrations

## Security Considerations

1. **APP_KEY**: Keep your `APP_KEY` secret and never commit it to version control
2. **Token Security**: Banner tokens are randomly generated - treat them as secrets
3. **CORS**: Configure CORS settings in `config/cors.ts` for production
4. **Rate Limiting**: Consider adding rate limiting middleware for production
5. **Input Validation**: All inputs are validated via VineJS validators
6. **HTTPS**: Use HTTPS in production (configure via reverse proxy)

## Troubleshooting

### Canvas Library Issues

If you encounter Canvas-related errors:

**Linux**:

```bash
sudo apt-get update
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

**macOS**:

```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

**Alpine (Docker)**:
The base image includes necessary dependencies.

### Database Locked Errors

SQLite may lock if multiple processes access it. Ensure only one instance runs, or migrate to PostgreSQL/MySQL for production.

### Port Already in Use

Change the `PORT` environment variable or stop the conflicting service.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0-only).

See [LICENSE.md](./LICENSE.md) for the full license text.

## Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Built with ❤️ using AdonisJS**
