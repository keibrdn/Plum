// Controller handler to handle functionality in home page
const User = require('../models/User')
// Example for handle a get request at '/' endpoint.



function getLogin(request, response){
  // do any work you need to do, then
  User.find().lean().then(items =>
    {
      response.render('login', {title: 'login'});
    })

}

module.exports = {
    getLogin
};