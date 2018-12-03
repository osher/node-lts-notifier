# node-lts-notifier

A CLI tool that checks the node.js RSS feed and sends a notification mail whenver it detects a new LTS version.

The tool is intended to be run by a schedueler such as a cron-task or a jenkins job.

Uses the `nodemailer` npm package, and requires to be configured with an SMTP server.

# Install
```
npm i node-lts-notifier -g
```

## since: `0.4.0`:
Installing `node-lts-notifier` using `-g` adds an additional command to your machine:
 - `node-lts-notif`

Run it from your shell or from your favorite schedueler.
 
# Configure
## since: `0.4.0`

Once ran, it expects a configuration file, and will terminate with an error and a friendly 
message if this file is not found, or if it cannot be parsed as a valid `yaml`.

e.g:
```
ERROR: Cannot open configuration file
tried path:
  /home/centos/.lts-notif.yaml

effecting env-vars:
 - LTS_NOTIF_FILE - path to the yaml file
 - LTS_NOTIF_HOME - when LTS_NOTIF_FILE is unset, may indicate location of a .lts-notif.yaml file
 - HOME/HOMEPATH  - when LTS_NOTIF_HOME is unset, .lts-notif.yaml is searched in user's home directory

error:
  ENOENT: no such file or directory, open '/home/centos/.lts-notif.yaml'
```

If you provided a full path usign `LTS_NOTIF_FILE` or you provided the path to the directory a `.lts-notif.yaml` is found using `LTS_NOTIF_HOME`, or you have placed it in your home directory -
the file it's looking for should look like the following example:

```
message:
  to:
   - name:    Osher E.
     address: onetanany@mycooldomain.com
  from:
   - name:    Node LTS
     address: noreply@mycooldomain.com

nodemailer:
  type:     smtp
  options:
    host:   mailgw.mycooldomain.com
    tls:
      rejectUnauthorized: false

reported:

```
*NOTES:* 
1. This is a rather basic example, which passes to `nodemailer` smtp configuration of a relay server.
   However - you can pass in `nodemailer.options` any valid [`nodemailer`](https://community.nodemailer.com/2-0-0-beta/setup-smtp/) configuration.
   version `0.4.0` supports just `smtp` setups - because they do not require any processing and can be passed as is to `nodemailer`.
   Future versions will add `gmail`, `aws`, etc.
   Having said that - `nodemailer`'s `smtp` setup support quite a lot :)
2. The `reported` section must be in the end of the file and the file *must end with an empty line*.
   The code appends a line as a string array-item to this file for each reported LTS version.
   It does so in order to remember what it has already reported before.

# Usage
##since `0.4.0`:

Run the `node-lts-notif` from your shell or from your favorite schedueler.

##since `0.1.2`:
This initial version implements only the core module, without the `bin` file to wrap it in a mature CLI - this wrap will come in the future, as my free time allows it.

The way I run it now is using a Jenkins job, where the command is in the following spirit (domain and emails replaced with `example.com`):

```
node -e "require('node-lts-notifier/lib')({reportFrom: 'Node LTS Notifier<no-reply@example.com>', reportTo: ['devteam@example.com','opsteam@example.com'], smtp: { host: 'mailgw.example.com',  tls: { rejectUnauthorized: false }}}).then(console.log);"
```

Mind the `smtp` field in the passed options.
This example is the simplest - it uses a relay smtp in the local LAN.

However - this  `smtp` object is currently passed as is to `nodemailer` - so you may pass whatever you need, including creds.
The only `nodemailer` config that is not trivial is `aws transport` - which will be dealt in the future.

# Custom formatter
## since `0.4.0`
*_experimental_*:
You can provide a node.js module to handle message formatting by providing in your configuration a `customFormatter` key.
 - When it's an object - it's expected to have property `module` - a path to the module.
 - When it's a string - it's converted to an object, using the string value as the `module` property. 

If the loaded module exports an .init(conf) method - it's being passed the `customFormatter` section, 
and the returned value is used as the custom formatter.
If not - the returned value of the required module is passed as the custom formatter as is.

The value is overriding the built-in formatter, and may override:
 - `subject({title}):String` - format your own subject
 - `body({title, pubDate, link, description}):String` - format your own body from the info in feed
 - `message(feed, msgDefaults): message` - overriding this method negates the previous two.
    it should return a valid `nodemailer` message object.
    The default returns:
     - `from` and `to` from `msgDefaults` - which is basically, the `message` section from the config, 
     - `subject`, and `html` as formatted by the previous two APIs.

# Future
 - config check with idiot-proof error messages
 - mature the repo
   - add a test suite
   - add CI
   - add coverage tool
   - move docs to a site / wiki
 - support nodemailer gmail transport
 - support nodemailer aws transport
