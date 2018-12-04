const sinon = require('sinon');
const SUT = require('../lib/formatter');
const rndSeed = Math.ceil(Math.random()*1000000)
const mockFeed = {
  title: 'title' + rndSeed,
  pubDate: 'pubDate' + rndSeed,
  link: 'link' + rndSeed,
  description: 'description' + rndSeed
}

module.exports = {
  'lib/formatter': {
    'should be a module with 3 apis: subject, body, message':
      () => Should(SUT).be.an.Object().have.properties(
        ['subject', 'body', 'message']
      ),
    '.subject(..)': {
      'should be a method that expects 2 params - feed, messageDefaults':
        () => Should(SUT.subject).be.a.Function().property('length', 2),
      'when called with valid feed as 1st parameter': {
        'should return `Released: ${title}`':
          () => Should(SUT.subject(mockFeed))
            .be.a.String()
            .eql('Released: ' + mockFeed.title)
      }
    },
    '.body(..)': {
      'should be a method that expects 2 params - feed, messageDefaults':
        () => Should(SUT.body).be.a.Function().property('length', 2),
      'when called with valid feed': {
        'should return formatted HTML body, starting with the title enclosed in H1':
          () => Should(SUT.body(mockFeed))
            .be.a.String()
            .startWith(`<h1>${mockFeed.title}</h1>`)
      }
    },
    '.message(..)': {
      'should be a method that expects 2 params - feed, messageDefaults':
        () => Should(SUT.message).be.a.Function().property('length', 2),
      'when called with valid feed': {
        'and message defaults': {
          beforeAll: () => {
              sinon.stub(SUT, 'subject').returns('s');
              sinon.stub(SUT, 'body').returns('b');
          },
          afterAll: () => {
              SUT.subject.restore();
              SUT.body.restore();
          },
          'should create a message with subject and html, enriched with the message defaults':
            () => Should(SUT.message(mockFeed, {
              some: 'properties',
              whatever: 'is',
              provided: 'in config',
              will: 'be passed'
            })).eql({
              subject: 's',
              html: 'b',

              some: 'properties',
              whatever: 'is',
              provided: 'in config',
              will: 'be passed'
            })
          
        },
        'and message defaults contains subject': {
          'should use subject from message defaults':
            () => Should(SUT.message(mockFeed, {subject: 'overriden'}))
              .have.property('subject', 'overriden')
        },
        'and message defaults contains html': {
          'should use body from message defaults.html':
            () => Should(SUT.message(mockFeed, {html: 'overriden'}))
              .have.property('html', 'overriden')
        }
      }
    }
   
  }
}