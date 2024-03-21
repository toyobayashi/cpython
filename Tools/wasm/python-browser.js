/// <reference path="monaco.d.ts" />

const startInstance = (onExit) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./python-browser.worker.js')
    worker.onerror = (e) => {
      reject(e)
      worker.terminate()
    }
    worker.onmessage = (event) => {
      if (event.data.type === 'ready') {
        resolve(worker)
      } else if (event.data.type === 'finished') {
        onExit(event.data.returnCode)
        worker.terminate()
      }
    }
  })
}

const run = (filecontent) => {
  return new Promise((resolve) => {
    return startInstance(resolve).then(worker => {
      worker.postMessage({
        type: 'run',
        args: filecontent
      })
    })
  })
}

const printVersion = () => {
  return new Promise((resolve) => {
    return startInstance(resolve).then(worker => {
      return new Promise(() => {
        worker.postMessage({
          type: 'printVersion',
        })
      })
    })
  })
}

const scripts = document.getElementsByTagName('script')
const pyscript = Array.prototype.filter.call(scripts, (s => s.type === 'text/python'))[0]

printVersion().then(() => {
  return run(pyscript.innerText)
})


require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs' } });
require(['vs/editor/editor.main'], function () {
  const editor = monaco.editor.create(document.getElementById('container'), {
    value: pyscript.innerText,
    language: 'python',
    fontSize: 18,
    theme: 'vs-dark',
    automaticLayout: true
  });

  editor.onDidChangeModelContent((e) => {
    // console.log(e)
  })

  document.getElementById('run').addEventListener('click', () => {
    run(editor.getValue())
  })
});
