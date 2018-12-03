module.exports = ({
  //supported configs
  feedUrl       = 'http://nodejs.org/en/feed/releases.xml',
  message: msgDefaults,
  reported      = [],
  // -- initiated by lib/config:
  srcFile: reportedList,
  formatter,
  mx,
  // -- other injectables:
  debug         = require('debug')('lts-notif'),
  Promise       = global.Promise,
  fs            = require('fs'),
  x2j           = require('xml2js'),
  ax            = require('axios'),
} = {}) =>
  ax.get(feedUrl)
  .then(({data}) => new Promise(
    (a,r) => x2j.parseString(data, (err, doc) => err ? r(err) : a(doc))
  ))
  .then(doc =>
    debug('rss feed retrieved and parsed', doc)
    || doc.rss.channel[0].item
    .filter(({title}) => title[0].includes('(LTS)'))
    .map(({
        title:        [title],
        pubDate:      [pubDate],
        link:         [link],
        description:  [description],
        'dc:creator': [creator],
    }) => ({title, pubDate, link, description, creator}))
  )
  .then(([feed]) =>
    debug('title=%s reported', feed.title, reported)
    || reported.some(line => line.includes(feed.title))
       && Promise.resolve({success:true, msg:'no new LTS detected'})
    || new Promise((a,r) => debug('sending to', msgDefaults.to) || mx.sendMail(
        formatter.message(feed, msgDefaults),
        e => e
          ? r(e)
          : debug('sent to', msgDefaults.to) || a()
      ))
      .then(() => new Promise((a, r) =>
        fs.appendFile(
          reportedList,
          ` - ${feed.title} - ${new Date(feed.pubDate).toUTCString()}\n`,
          e => e
          ? r(e)
          : debug('saved')
            || a({
              success: true,
              msg: 'mail notification sent about the new LTS',
              title: feed.title
            })
        )
      ))
  );
