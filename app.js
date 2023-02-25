const app = require('express')()
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cors = require('cors')
const http = require('http')
const {ChatTokenBuilder} = require('agora-token')

const hostname = 'localhost'
const port = 3000
const appId = "5370ec63ae0e45049f505706b571f329";
const appCertificate = "256fd547f470426c8726e283763b6508";
const expirationInSeconds = 86400;

const userInDB = {
  account: 'app-user-account',
  password: 'app-password',
  chatUsername: 'test-chat-username',
  userUuid: 'uuid from Chat Server'
}

app.use(cors())
app.get('/login', async (req, res) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  var raw = JSON.stringify({
    "userAccount": req.query.account,
    "userPassword": req.query.password,
    "userNickname": req.query.account
  });
  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  
  await fetch("https://a61.chat.agora.io/app/chat/user/login", requestOptions)
    .then(response => response.json()).
    then(json =>  {
      console.log(json)
      res.status(200).send({
        json
      })}).
    catch(error => console.log(error))
})

app.get('/register', async (req, res) => {
  /// pseudocode
  const appToken = ChatTokenBuilder.buildAppToken(appId, appCertificate, expirationInSeconds);
  const account = req.query.account
  const password = req.query.password
  const chatUsername = "<User-defined username>"
  const chatPassword = "<User-defined password>"
  const ChatNickname = "<User-defined nickname>"
  
  const body = {'username': account, 'password': password, 'nickname': account};
  
  await fetch('https://a61.chat.agora.io/61501494/1077360/users', {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'Authorization': "Bearer " + "007eJxTYJj/KEk5xCzf2bHIi6dKJnGv889rO9Zfvm9pyZW++6dI1QEFBlNjc4PUZDPjxFSDVBNTAxPLNFMDU3MDsyRTc8M0YyNLhd8/khsCGRn632ozMTKwMjAyMDGA+AwMAEm1HR0=",
    },
    body: JSON.stringify(body)
  }).then(res => 
    res.json()
    ).then(json =>  {
      res.status(200).send({
        json
      })}).
    catch(error => console.log(error))
})
  
function authenticate (account, password) {
  return account === userInDB.account && password === userInDB.password
    ? userInDB
    : false
}

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
