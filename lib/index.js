/*
require('nodemailer').createTransport({host:'mailgw.sealdoc.com', tls: { rejectUnauthorized: false }}).sendMail({from:'osher.filter@gmail.com', to: 'onetanany@blackberry.com', subject: 'hoo haa!', html: '<h1>boo!!</h1>'}, console.log)
*/
module.exports = ({
  reportTo,
  smtp,
  reportFrom    = reportTo,
  feedUrl       = 'http://nodejs.org/en/feed/releases.xml',
  reportedList  = './reported.txt',
}, {
  Promise       = global.Promise,
  fs            = require('fs'),
  x2j           = require('xml2js'),
  ax            = require('axios'),
  mx            = require('nodemailer').createTransport(smtp)
} = {}) =>
  !reportTo && Promise.reject({message:'cannot run without a target mail adderss'})
  || Promise.all([
    ax.get(feedUrl)
    .then(({data}) => new Promise(
      (a,r) => x2j.parseString(data,(e,d) =>
        e ? r(e) : a(d)
      )
    ))
    .then(d =>
      d.rss.channel[0].item
      .filter(({title}) => title[0].includes('(LTS)'))
      .map(({
          title: [title],
          pubDate: [pubDate],
          link: [link],
          description: [description]
      }) => ({title, pubDate, link, description}))
    ),
    new Promise((a,r) =>
      fs.readFile(reportedList, (e, buff) =>
        e && e.code != 'ENOENT'
        ? r(e) 
        : a(buff && buff.length && buff.toString().split('\n') || [])
      )
    )
  ])
  .then(([[{title, description, pubDate, link}], reported]) =>
console.log('title=%s reported', title, reported) ||
    reported.some(line => line.includes(title)) && Promise.resolve({success:true,msg:'no new LTS detected'})
    || new Promise((a,r) => mx.sendMail({
        from:     reportFrom,
        to:       reportTo,
        subject:  'Relrased: ' + title,
        html:     `<h1>${title}</h1>Released at ${pubDate}<br><a href="${link}">blog announcement</a><h2>Changes</h2>${description}`,
      }, (e) =>
console.log('sent', e || 'OK') ||
        e ? r(e) : a()
      ))
      .then(() => new Promise((a,r) =>
console.log('saving') ||      
        fs.appendFile(
          reportedList,
          `${title} - ${pubDate}\n`,
          e =>
console.log('saved', e || 'OK') ||
            e ? r(e) : a({success: true, msg: 'mail notification sent about the new LTS', title})
        )
      ))
  );
