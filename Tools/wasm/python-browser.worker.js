var Module = {}
Module.noInitialRun = true
Module.mainScriptUrlOrBlob = 'python.js'
Module.onRuntimeInitialized = () => {
  // console.log('onRuntimeInitialized')
  postMessage({
    type: 'ready'
  })
}
Module.locateFile = (name, base) => {
  base = '/builddir/emscripten-browser/'
  return base + name
}

importScripts('../../builddir/emscripten-browser/python.js')

onmessage = (event) => {
  if (event.data.type === 'run') {
    try {
      Module.FS.lstat('/app')
    } catch (_) {
      Module.FS.mkdir('/app')
    }
    Module.FS.writeFile('/app/main.py', event.data.args, { flags: 'w+' });

    console.log('$ python.wasm /app/main.py')
    const ret = callMain(['/app/main.py'])
    postMessage({
        type: 'finished',
        returnCode: ret
    })
    console.log('')
  } else if (event.data.type === 'printVersion') {
    console.log('$ python.wasm -VV')
    const ret = callMain(['-VV'])
    postMessage({
      type: 'finished',
      returnCode: ret
    })
    console.log('')
  }
}
