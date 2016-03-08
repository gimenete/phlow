# phlow

Get to work as quick as possible.

This is an experiment and right now only works on OSX with iTerm2.

# Installation

```
npm install phlow -g
```

# Usage

You can use phlow in two ways:

* Create a `~/.phlow` directory and put the JSON files there.
* And/or create individual `phlow.json` files in the working directory of each project. In this case you need to set up the `PHLOW_HOMEDIR` env variable. This tells phlow where your projects are. For example I use `/Users/gimenete/projects`. Phlow will look in all the subdirectories of the `PHLOW_HOMEDIR`. By default `PHLOW_HOMEDIR` is your home directory.

A configuration file looks like this

```json
{
  "dir": "/Users/gimenete/projects/backbeam-lambda-ui",
  "iTerm": {
    "tabs": [
      {
        "panels": [
          {
            "commands": [
              "npm run watch"
            ]
          },
          {
            "split": "vertically",
            "commands": [
              "npm start"
            ]
          },
          {
            "split": "horizontally",
            "commands": [
              "atom ."
            ]
          }
        ]
      }
    ]
  }
}
```

So you could save that file as:

* `~/.phlow/project_name.json`
* Or `$PHLOW_HOMEDIR/project_name/phlow.json`. In this case you don't need to put the `dir` in the configuration file.

Finally run:

```bash
phlow project_name
```

The project name doesn't need to be strictly equal. Phlow will look for the most similar directory name with a `phlow.json` file on it or the most similar configuration file under `~/.phlow`. Also, phlow will always ask for confirmation before running anything.
