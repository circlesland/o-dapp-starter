#!/bin/bash
echo "Installing build dependencies .."
npm i
npx --no-install lerna bootstrap || exit

echo "Building 'omo-quirks' .."
cd packages/omo-quirks || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'omo-utils' .."
cd omo-utils || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'omo-events' .."
cd omo-events || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'omo-process' .."
cd omo-process || exit
npx --no-install tsc || exit
cd .. || exit

echo "Building 'omo-kernel-interfaces' .."
cd omo-kernel-interfaces || exit
npx --no-install tsc || exit
cd ../.. || exit

echo "Building 'shell' with dapps .."
cd shell || exit
npm run build
cd .. || exit
