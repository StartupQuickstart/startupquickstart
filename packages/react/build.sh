rm -rf dist
mkdir dist
babel ./src/components -d dist/components --copy-files
babel ./src/context -d dist/context --copy-files
babel ./src/lib -d dist/lib --copy-files
babel ./src/views -d dist/views --copy-files

mkdir ./dist/assets
cp -r ./src/assets/fonts dist/assets/fonts
cp -r ./src/assets/images dist/assets/images

node-sass ./src/assets/scss/main.scss -o dist/assets/css
cd ./dist/assets/css/ && sed -i '' 's|../../fonts|../fonts|g' main.css