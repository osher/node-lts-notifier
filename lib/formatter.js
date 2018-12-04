const body = ({title, pubDate, link, description}, messageDefaults) =>
`<h1>${title}</h1>
<ul><li> Released at ${pubDate}</li></ul>
<a href="${link}">blog announcement</a>
<h2>Changes</h2>
${description}`;

const subject = ({title}, messageDefaults) =>
`Released: ${title}`;

const message = (feed, messageDefaults) =>
  Object.assign({
    subject:  formatter.subject(feed, messageDefaults),
    html:     formatter.body(feed, messageDefaults)
  }, messageDefaults);

const formatter = module.exports = {subject, body, message};
