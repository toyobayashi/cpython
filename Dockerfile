FROM scratch

# COPY ./builddir/install /usr/local/
COPY ./builddir/wasi/usr/local /usr/local

ENTRYPOINT [ "/usr/local/bin/python.wasm" ]
