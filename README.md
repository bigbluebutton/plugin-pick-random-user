
# Pick random user

## What is it?

The Pick Random User Plugin shows a modal for the moderator to pick a user (mainly viewer, but it could also be a moderator) randomly out of the whole list of users present in a meeting.

![Gif of plugin demo](./public/assets/plugin.gif)

## Plugin Versioning

Please be aware that we have a separate branch of this plugin for each version of the SDK. This ensures that everything merged into a branch is compatible with the corresponding version of the BigBlueButton core. As of now, here’s the correspondence between the branches, SDK versions, and BigBlueButton core versions:

| Repository Branch | Plugin-SDK Version | BigBlueButton Core Version |
|------------------|--------------------|----------------------------|
| v0.0.x           | v0.0.x             | v3.0.x                     |
| v0.1.x           | v0.1.x             | v3.1.x                     |

Note that this branch (`main`) does not contain any code, as it is used only for basic documentation. For more information about the plugin API features, see the documentation (`readme` files) within the specific branch you are interested in. We separate the branches because, going forward, `v0.1.x` is becoming more and more different from `v0.0.x`.

If you have any suggestions, requirements, or questions, don’t hesitate to contact us.

## Necessary configurations

By default, no ping is sounded for the randomly picked user. To activate this feature, you must add the following configurations in your `/etc/bigbluebutton/bbb-html5.yml` file.

In that file, within `public.plugins`, add the following configurations:

```yaml
- name: PickRandomUserPlugin
      settings:
        pingSoundEnabled: true
        pingSoundUrl: resources/sounds/doorbell.mp3
```

The result YAML will look like this:

```yaml
public:
  # ...
  plugins:
    - name: PickRandomUserPlugin
      settings:
        pingSoundEnabled: true # Enables the ping sound for this plugin true/false
        pingSoundUrl: resources/sounds/doorbell.mp3 # This is the default and is not mandatory
```

Just a minor comment: These relative URLs can only be configured if the server on which BBB is running is not a cluster setup. If that's your case, you'll need to put the full URL into the configuration. It's also worth mentioning that the default `pingSoundUrl` will work in cluster setups, so no worries on that.

Some other possible `pingSoundUrl` options are (and notice that these URLs can be relative, if the `mp3` sound is being served from within the BBB server – and it's not a cluster setup – as shown right below):
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

These are the possible `mp3` files that already come with a BBB server. If you want a custom sound, just add the URL to the `mp3` file there, and it will work out of the box.

## Building the Plugin

To build the plugin for production use, follow these steps:

```bash
cd $HOME/src/plugin-pick-random-user-plugin
npm ci
npm run build-bundle
```

The above command will generate the `dist` folder, containing the bundled JavaScript file named `PickRandomUserPlugin.js`. This file can be hosted on any HTTPS server along with its `manifest.json`.

If you install the Plugin separately from the manifest, remember to change the `javascriptEntrypointUrl` in the `manifest.json` to the correct endpoint.

To use the plugin in BigBlueButton, send this parameter along in the create call:

```
pluginManifests=[{"url":"<your-domain>/path/to/manifest.json"}]
```

Or additionally, you can add this same configuration in `/etc/bigbluebutton/bbb-web.properties`.

## Development mode

As for development mode (running this plugin from source), please refer back to [https://github.com/bigbluebutton/bigbluebutton-html-plugin-sdk](https://github.com/bigbluebutton/bigbluebutton-html-plugin-sdk) section `Running the Plugin from Source`
