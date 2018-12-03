require('colors');
Promise.resolve()
.then(() => require('../lib/config')({}))
.then((cfg) => require('../lib')(cfg))
.then((r) => console.log('done', r))
.catch((e) => console.log('oups...\n'.red, e));
