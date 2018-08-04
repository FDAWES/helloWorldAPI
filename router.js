module.exports = {
  hello: function(data, cb){
    cb(200, {
      message: "HELLO! Welcome to our WORLD!"
    })
  },
  notFound: function(data, cb){
    return cb(404, { message: "Sorry buddy...:P!"});
  }
}