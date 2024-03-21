#!/usr/bin/env bash

set -e

./Tools/wasm/wasm_build.py wasi

cd ./builddir/wasi
make wasm_stdlib
unzip -d ./usr/local/lib/python3.11 -o ./usr/local/lib/python311.zip
rm -rf ./usr/local/lib/python311.zip
mkdir -p ./usr/local/bin
cp -rpf ./python.wasm ./usr/local/bin/

cd ../..

docker buildx build -t toyobayashi/wasmpy --platform wasi/wasm .
docker run --rm --platform=wasi/wasm --runtime=io.containerd.wasmedge.v1 -v $(pwd):/app toyobayashi/wasmpy /app/main.py
