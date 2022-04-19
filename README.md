# Action nxtlvlsoftware/tar-action

GitHub action for running tar operations in actions workflows.

| Action Input | Required | Default            | Description                                                                                                              |
|--------------|----------|--------------------|--------------------------------------------------------------------------------------------------------------------------|
| operation    | true     |                    | Specifies the tar operation to run. Options are: compress (alias = c) OR extract (alias = x)                             |
| files        | true     |                    | Specifies the files to compress OR a single tar archive to extract. List syntax supported (see example below.)           |
| outPath      | true     |                    | Specifies the output tar file OR the directory to extract files to.                                                      |
| cwd          | false    | action working dir | Specifies the current working directory for operations (will be prepended to files and outPath if they're not absolute.) |

## How to use
Simple tar archive creation and artifact upload:

```yml
name: My Workflow
on: [push]
jobs:
  create-archive:
    name: tar
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - uses: nxtlvlsoftware/tar-action@v1
        with:
          operation: compress
          files: |
            My-Repo/index.ts
            My-Repo/src
            My-Repo/node_modules
          outPath: My-Repo-Sources.tar.gz
      - name: Upload artifacts
        uses: actions/upload-artifact@v2
        with:
          name: My-Repo-Sources-Compressed
          path: My-Repo-Sources.tar.gz
          retention-days: 1
```

Then download and extract your archive in another run step:
```yml
name: My Workflow 2
on: [push]
jobs:
  setup-php:
    name: tar extract
    runs-on: ubuntu-latest
    steps:
      - name: Download all artifacts from this action run
        uses: actions/download-artifact@v3
        with:
          path: ./
      - uses: nxtlvlsoftware/tar-action@v1
        with:
          operation: extract
          files: ./My-Repo-Sources.tar.gz
          outPath: ./My-Repo-Sources
```

# Use cases
Allows checking-out your repo, running dependency management commands, code linting and other build/compile time steps, then re-using the processed code across multiple steps without running all the prerequisites again.
