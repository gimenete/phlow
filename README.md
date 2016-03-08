# phlow

Get to work as quick as possible.

This is an experiment and right now only works on OSX with iTerm2.

# Installation

```
npm install phlow -g
```

# Usage

Create a `phlow.json` file in the working directory of your project like this one

```json
{
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

Set up the `PHLOW_HOMEDIR` env variable. This tells phlow where your projects are. For example I use `/Users/gimenete/projects`. Phlow will look in all the subdirectories of the `PHLOW_HOMEDIR`. By default `PHLOW_HOMEDIR` is your home directory.

Finally run:

`phlow project_name`

The project name doesn't need to be strictly equal. Phlow will look for the most similar directory name with a `phlow.json` file on it. And phlow will always ask for confirmation before running anything.
