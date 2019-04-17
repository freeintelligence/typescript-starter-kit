const { BaseCommand, Scheduler } = require('task-scheduling')
const { CopyCommand } = require('./copy_command')
const fs = require('fs-extra')
const path = require('path')

const tsconfig = require('./../tsconfig.json')

class WatchCommand extends BaseCommand {

  constructor() {
    super()

    this.name = 'watch'
    this.description = 'Compile every time a file change is detected.'

    this.files = new CopyCommand().files
  }

  async run() {
    await this.execute('build')

    fs.watch(tsconfig.compilerOptions.baseUrl, async (event, filename) => await this.execute('build'))

    for(let i = 0; i < this.files.length; i++) {
      const file = this.files[i]
      fs.watch(path.join(file), async (event, filename) => {
        await this.execute('copy')
      })
    }
  }

  async execute(command) {
    await Scheduler.execute([command])
  }

}

module.exports.WatchCommand = WatchCommand
