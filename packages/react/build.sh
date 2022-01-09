rm -rf dist
mkdir dist
babel ./src/components -d dist --copy-files
babel ./src/context -d dist --copy-files
babel ./src/lib -d dist --copy-files
babel ./src/views -d dist --copy-files