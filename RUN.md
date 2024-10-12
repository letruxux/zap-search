<h1 style="text-align: center;">Other choices to run zap</h1>

## Run in development

You should use this if you want to contribute to the project.

Opens backend on port 5180 and frontend on port 5173.

### Install dependencies

```bash
bun install
```

### Run

```bash
bun run start:all
```

## Run with Docker

You should use this if you want to run zap without having to install anything.

- Want to host it for personal use? Use this.
- Want to host a public instance? Use this.

> [!NOTE]  
> If you don't know how to install docker, how to setup the container etc. follow the official [Docker Get Started guide](https://docs.docker.com/get-started/).

### Build

```bash
docker build -t zap .
```

### Run

```bash
docker run -p PORT:5180 zap
```
