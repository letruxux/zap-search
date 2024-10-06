<h1 style="text-align: center;">zap search</h1>

<p style="text-align: center;">zap search is a search engine built in <a href="https://bun.sh/docs/installation">bun</a> that allows you to search for games, software and other miscellaneous content easily with a simple web interface.</p>

# Run locally

- Download the latest exe from the [releases](https://github.com/letruxux/zap-search/releases) page.
- Extract the archive to a folder.
- Run the executable.
- Don't move the dist folder or the executable away: they must be in the same folder.

## Run in development

### Build

```bash
bun install
```

### Run

```bash
bun run start:all
```

## Run with Docker

### Build

```bash
docker build -t zap .
```

### Run

```bash
docker run -p PORT:5180 zap
```

## Contribute

Want to contribute? Open an issue or a pull request.

## Donate

If you like this project, please consider [donating to the developer](https://ko-fi.com/letruxux).
