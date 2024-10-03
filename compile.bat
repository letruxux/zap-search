@echo off
cd ./www
bun run build --emptyOutDir
cd ../server
bun build ./index.ts --compile --outfile ./../server.exe
echo -
echo Done, run server.exe.