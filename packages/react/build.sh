rm -rf dist
mkdir dist
babel ./src/authenticators -d dist/authenticators --copy-files
babel ./src/components -d dist/components --copy-files
babel ./src/context -d dist/context --copy-files
babel ./src/effects -d dist/effects --copy-files
babel ./src/lib -d dist/lib --copy-files
babel ./src/routes -d dist/routes --copy-files
babel ./src/views -d dist/views --copy-files
babel ./src/exports.js -d dist

mkdir -p ./dist/assets
mkdir ./dist/assets/css
cp -r ./src/assets/fonts dist/assets/fonts
cp -r ./src/assets/images dist/assets/images

themes=("main" "dark" "dark-blue" "light-blue")

for theme in ${themes[@]}; do
  node-sass ./src/assets/scss/$theme.scss -o dist/assets/css
done

cd ./dist/assets/css/

for theme in ${themes[@]}; do
  sed -i '' 's|../../fonts|../fonts|g' $theme.css
  sed -i '' 's|~@fortawesome/fontawesome-free/webfonts|../fonts|g' $theme.css
done