const body = ({title, pubDate, link, description}) =>
`<h1>${title}</h1>
<ul><li> Released at ${pubDate}</li></ul>
<a href="${link}">blog announcement</a>
<h2>Changes</h2>
${description}`;

const subject = ({title}) =>
`Released: ${title}`;

const message = (feed, messageDefaults) =>
  Object.assign(messageDefaults, {
    subject:  subject(feed),
    html:     body(feed)
  });

module.exports = {subject, body, message};
