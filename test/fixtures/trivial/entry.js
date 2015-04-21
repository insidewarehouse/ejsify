var template = require("./tpl.ejs")

module.exports = function () {
  document.body.innerHTML = template({ name: "Test <b>escaped</b>" })
}
