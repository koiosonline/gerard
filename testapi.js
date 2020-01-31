const Webflow = require('webflow-api')

const infuraKey = fs.readFileSync(".apikey")
    .toString().trim(); // infura key


const webflow = new Webflow({ token: 'd59f681797fbb3758b2a0ce8e5f31a199e2733110cb468bb2bb0d77f23417b32' })

webflow.info()
  .then(info => console.log(info))
  