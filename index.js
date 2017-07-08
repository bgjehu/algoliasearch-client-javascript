const algolia = require('algoliasearch');
const {isEmpty, remove} = require('lodash');

const json = require('./bs.json');

const client = algolia('applicationID', 'apiKey');
const index = client.initIndex('index');

const push = obj => new Promise((resolve, reject) => index.addObjects(obj, (err, content) => (err ? reject : resolve)(err ? err : content)));

(async arr => {
    const cap = 4000;
    let pushed = 0;
    const all = arr.length;
    while (!isEmpty(arr)) {
        const cur = remove(arr, (obj, index) => index < cap);
        const {length} = cur;
        await push(cur);
        pushed += length;
        console.log(`Pushed ${length} entries (all: ${all}, pushed: ${pushed}, left: ${all - pushed})`);
    }
})(json).catch(err=>console.log(err.message));