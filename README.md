#node-lts-notifier

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

```
node-lts
```

# Future
 - support nodemailer aws transport
