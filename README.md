# Codeflows
Codeflows is an easy way for project creators or experienced devs to show new contributors how the logic of a program works. 

Every project, especially in dynamic languages, has function calls across files or includes that seemingly come from the void. Finding where these paths lead can be a nightmare especially on large projects. 

Codeflows allows you to say "This function call goes to this location in this file" with 2 button presses. This is then saved to a .codeflows file in your project and when anyone else loads up the project these paths are shown to them so they can navigate around and understand the overall flow much faster than ever before. 

The flows are stored in JSON format so they can be understood by any language. See the examples folder for an idea of how it works. 

It's currently only available as a plugin for Cloud9 but please feel free to create a plugin for your favorite IDE and add a link to this readme. 


## Contributing

### Cloud9 Plugin

Making changes to this plugin and testing them is quite simple. Here's how:

- Fork this project
- Create a new Cloud9 workspace from the Github url of your fork.
- `mkdir ~/.c9/plugins`
- `ln -s ~/workspace/plugins/cloud9 ~/.c9/plugins/codeflows`
- Reload your environment with ?debug=2 in the url

Codeflows will now be loaded in your environment and you can make changes to plugins/cloud9 then refresh and you'll immediately see them in action. 

For more information on developing plugins for Cloud9 see https://cloud9-sdk.readme.io/docs

## License

MIT
