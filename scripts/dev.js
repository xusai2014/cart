const { spawn } = require('node:child_process')
const path = require('node:path')

const root = path.join(__dirname, '..')

function start(name, port) {
  const cwd = path.join(root, 'apps', name)
  const nextBin = require.resolve('next/dist/bin/next', { paths: [cwd, root] })
  const child = spawn(
    process.execPath,
    [nextBin, 'dev', '--hostname', '127.0.0.1', '--port', String(port)],
    { cwd, stdio: 'inherit' },
  )
  child.on('exit', (code) => {
    console.error(`${name} exited with ${code}`)
    process.exit(code ?? 1)
  })
}

start('bff', 3001)
start('web', 3000)
