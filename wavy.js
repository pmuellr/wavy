'use strict'

const fs = require('fs')
const path = require('path')

const chalk = require('chalk')
const minimist = require('minimist')

const argvOpts = {
  boolean: ['help'],
  alias: {
    h: 'help',
    i: 'interval'
  },
  default: {
    help: false,
    interval: 250
  }
}

const argv = minimist(process.argv.slice(2), argvOpts)

if (argv.help) help()

const message = argv._.join(' ').trim()
if (message === '') help()

if (typeof argv.interval !== 'number') argv.interval = argvOpts.default.interval

let Indent = 0
let IndentIncr = 1
const IndentMax = 40

const stdout = chalk.bgGreen.black('stdout')
const stderr = chalk.bgRed.black('stderr')
const colors = [
  chalk.red,
  chalk.green,
  chalk.yellow,
  chalk.blue
]

setInterval(write, argv.interval)

// write the message
function write () {
  const colorIndex = Math.min(
    colors.length - 1,
    Math.floor(Indent / (IndentMax / colors.length))
  )
  const ind = indent()
  const msg = colors[colorIndex](message)

  console.log(stdout, ind, msg)
  console.error(stderr, ind, msg)

  recalcIndent()
}

// get the current indent string
function indent() {
  return Array(Indent + 1).join(' ')
}

// recalcuate the next indent
function recalcIndent () {
  Indent += IndentIncr

  if (Indent < 0) {
    Indent = 1
    IndentIncr = 1
    return
  }

  if (Indent > IndentMax) {
    Indent = IndentMax - 1
    IndentIncr = -1
    return
  }
}

// print some help then exit
function help () {
  console.log(fs.readFileSync(path.join(__dirname, 'README.md'), 'utf8'))
  process.exit(1)
}
