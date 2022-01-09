rm -rf dist
mkdir dist
babel ./src/components -d dist/components --copy-files
babel ./src/context -d dist/context --copy-files
babel ./src/lib -d dist/lib --copy-files
babel ./src/views -d dist/views --copy-files