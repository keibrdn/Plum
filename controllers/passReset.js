// Controller handler to handle functionality in home page
const User = require('../models/User')
// Example for handle a get request at '/' endpoint.



function getpassReset(request, response){
  // do any work you need to do, then
  User.find().lean().then(items =>
    {
      response.render('passReset', {title: 'Password Reset'});
    })

}

module.exports = {
    getpassReset
};