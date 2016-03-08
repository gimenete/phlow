#!/usr/bin/env node

var os = require('os')
var fs = require('fs')
var path = require('path')
var pify = require('pify')
var levenshtein = require('fast-levenshtein')
var osascript = require('osascript-promise')
var inquirer = require('inquirer')

function buildScript (config, file) {
  var dir = config.dir || path.dirname(file)
  var lines = []
  if (config.iTerm) {
    lines.push('tell application "iTerm"')
    lines.push('tell current window')
    config.iTerm.tabs.forEach((tab) => {
      lines.push('set newTab to (create tab with default profile)')
      lines.push('tell current session')
      tab.panels.forEach((panel) => {
        if (panel.split) {
          lines.push(`set newSession to (split ${panel.split} with default profile)`)
          lines.push('tell newSession')
        }
        lines.push(`write text "cd ${dir}"`)
        panel.commands.forEach((command) => {
          lines.push(`write text "${command.replace('"', /\\"/g)}"`)
        })
        if (panel.split) {
          lines.push('end tell')
        }
      })
      lines.push('end tell')
    })
    lines.push('end tell')
    lines.push('end tell')
  }
  return lines.join('\n')
}

var homedir = process.env.PHLOW_HOMEDIR || os.homedir()
var project = process.argv[2]
pify(fs.readdir)(homedir)
  .then((dirs) => (
    dirs
      .filter((dir) => (
        fs.existsSync(path.join(homedir, dir, 'phlow.json'))
      ))
      .map((dir) => ({
        file: path.join(homedir, dir, 'phlow.json'),
        distance: levenshtein.get(dir, project)
      }))
      .sort((a, b) => a.distance - b.distance)[0]
  ))
  .then((closest) => (
    pify(fs.readdir)(path.join(os.homedir(), '.phlow'))
      .then((files) => (
        files.map((file) => ({
          file: path.join(os.homedir(), '.phlow', file),
          distance: levenshtein.get(path.basename(file, '.json'), project)
        }))
        .sort((a, b) => a.distance - b.distance)[0]
      ))
      .then((closestf) => (
        closestf && (!closest || closestf.distance < closest.distance) ? closestf : closest
      ))
      .catch(() => closest)
  ))
  .then((closest) => (
    closest || Promise.reject('No directory found with a name like that with a phlow.json file')
  ))
  .then((closest) => (
    new Promise((resolve, reject) => {
      var question = {
        type: 'confirm',
        name: 'confirm',
        message: `About to run ${closest.file}. Please confirm`,
        default: true
      }
      inquirer.prompt([question], (answer) => {
        if (!answer.confirm) return reject('Ok, moving on...')
        return resolve(closest)
      })
    })
  ))
  .then((closest) => (
    pify(fs.readFile)(closest.file, 'utf8')
      .then((config) => (
        osascript(buildScript(JSON.parse(config), closest.file))
      ))
  ))
  .catch((err) => {
    console.error(err.message || err.stack || String(err))
    process.exit(1)
  })
