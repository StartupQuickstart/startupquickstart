rm -rf dist
mkdir dist
babel ./src/components -d dist/components --copy-files
babel ./src/context -d dist/context --copy-files
babel ./src/effects -d dist/effects --copy-files
babel ./src/lib -d dist/lib --copy-files
babel ./src/routes -d dist/routes --copy-files
babel ./src/views -d dist/views --copy-files


mkdir ./dist/assets
cp -r ./src/assets/fonts dist/assets/fonts
cp -r ./src/assets/images dist/assets/images

node-sass ./src/assets/scss/main.scss -o dist/assets/css
node-sass ./src/assets/scss/dark.scss -o dist/assets/css
node-sass ./src/assets/scss/dark-blue.scss -o dist/assets/css
node-sass ./src/assets/scss/light-blue.scss -o dist/assets/css

cd ./dist/assets/css/

sed -i '' 's|../../fonts|../fonts|g' main.css
sed -i '' 's|../../fonts|../fonts|g' dark.css
sed -i '' 's|../../fonts|../fonts|g' dark-blue.css
sed -i '' 's|../../fonts|../fonts|g' light-blue.css