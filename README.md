# node-lts-notifier

A CLI tool that checks the node.js RSS feed and sends a notification mail whenver it detects a new LTS version.

The tool is intended to be run by a schedueler such as a cron-task.

Uses the `nodemailer` npm package, and requires to be configured with an SMTP server.

# Install
```
npm i node-lts-notifier -g
```

# Configure

TBD

# Usage

This initial version implements only the core module, without the `bin` file to wrap it in a mature CLI - this wrap will come in the future, as my free time allows it.

The way I run it now is using a Jenkins job, where the command is in the following spirit (domain and emails replaced with `example.com`):

```
node -e "require('node-lts-notifier/lib')({reportFrom: 'Node LTS Notifier<no-reply@example.com>', reportTo: ['devteam@example.com','opsteam@example.com'], smtp: { host: 'mailgw.example.com',  tls: { rejectUnauthorized: false }}}).then(console.log);"
```

The smtp object is passed to `nodemailer` - you may pass whatever you like :)


# Future
 - finish the CLI layer 
 - config check with idiot-proof error messages
 - update the README.md with config examples
 - support nodemailer aws transport
