# Pick random user

## What is it?

The Pick Random User Plugin shows a modal for moderator to pick a user (mainly viewer but it could also be a moderator) randomly out of the whole list of users present in a meetings. 

![Gif of plugin demo](./public/assets/plugin.gif)

## Necessary configurations

By default, no ping is sounded for the randomly picked user. To activate this feature, one must add the following configurations in their `/etc/bigbluebutton/bbb-html5.yml` file.

So within that file and in `public.plugins` add the following configurations:

```yaml
- name: PickRandomUserPlugin
      settings:
        pingSoundEnabled: true
        pingSoundUrl: resources/sounds/doorbell.mp3
```

The result yaml will look like:

```yaml
public:
  # ...
  plugins:
    - name: PickRandomUserPlugin 
      settings:
        pingSoundEnabled: true # Enables the ping sound for this plugin true/false
        pingSoundUrl: resources/sounds/doorbell.mp3 # This is the default and is not mandatory
```

Just a minor comment: This relative URLs can only be configured if the server on which BBB is running is not a cluster setup. If that's your case, you'll need to put the whole URL into the configuration. It's also worth mentioning that the default `pingSoundUrl` will work in cluser setups, so no worries on that.

Some other possible `pingSoundUrl` are (and notice that this URL can be relative, if the `mp3` sound is being served from within the BBB server - and it's not a cluster setup - as showed right below):
- resources/sounds/alarm.mp3  
- resources/sounds/bbb-handRaise.mp3  
- resources/sounds/LeftCall.mp3  
- resources/sounds/RelaxingMusic.mp3  
- resources/sounds/aristocratDrums.mp3  
- resources/sounds/CalmMusic.mp3  
- resources/sounds/notify.mp3  
- resources/sounds/ScreenshareOff.mp3  
- resources/sounds/audioSample.mp3  
- resources/sounds/doorbell.mp3  
- resources/sounds/Poll.mp3  
- resources/sounds/userJoin.mp3

These are the possible `mp3` that already come within a BBB server, if you want a custom sound, just add the URL to the `mp3` file there and it will work out of the box.

## Building the Plugin

To build the plugin for production use, follow these steps:

```bash
cd $HOME/src/plugin-pick-random-user-plugin
npm ci
npm run build-bundle
```

The above command will generate the `dist` folder, containing the bundled JavaScript file named `PickRandomUserPlugin.js`. This file can be hosted on any HTTPS server along with its `manifest.json`.

If you install the Plugin separated to the manifest, remember to change the `javascriptEntrypointUrl` in the `manifest.json` to the correct endpoint.

To use the plugin in BigBlueButton, send this parameter along in create call:

```
pluginManifests=[{"url":"<your-domain>/path/to/manifest.json"}]
```

Or additionally, you can add this same configuration in `/etc/bigbluebutton/bbb-web.properties`.


## Development mode

As for development mode (running this plugin from source), please, refer back to https://github.com/bigbluebutton/bigbluebutton-html-plugin-sdk section `Running the Plugin from Source`
