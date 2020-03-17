require('dotenv').config();
var path = require('path');
var fs = require('fs');
const saml2 = require('saml2-js');
const express = require('express');
const bodyParser = require('body-parser');
const cookieMiddleware = require('universal-cookie-express');
const session = require('express-session');
const cors = require('cors');
var https = require('https')


import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {
  StaticRouter
} from 'react-router-dom';

import App from '../src/App/App';
import '../src/index.scss';

const PORT = process.env.PORT || "3006";
const HOSTNAME = process.env.REACT_APP_HOSTNAME || "http://localhost:3006";
const ENTITYID = process.env.REACT_APP_ENTITYID || "sample-saml-app";
const HTTPS = process.env.REACT_APP_HTTPS || false;

const app = express();
//routes
const apis = require('./routes/apis');

//config
app.use(cors())
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('./build'));

app.use(session({
  secret: 'secret sauce',
  resave: false,
  saveUninitialized: true
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieMiddleware());

//Get IdP
function getidp(req) {
  let properties = null;

  let uuid = req.query.uuid;
  if (typeof uuid === 'undefined') {
    uuid = req.universalCookies.get('sample-saml-cookie');
  } else {
    if (HOSTNAME.toLowerCase().startsWith("https")) {
      req.universalCookies.set('sample-saml-cookie', uuid, {
        path: '/',
        sameSite: 'none',
        secure: true
      });
    } else {
      req.universalCookies.set('sample-saml-cookie', uuid, {
        path: '/',
        sameSite: 'none'
      });
    }
  }

  if (uuid) {
    properties = JSON.parse(fs.readFileSync('properties-' + uuid + '.json'));
  } else {
    properties = JSON.parse(fs.readFileSync('properties.json'));
  }

  let idp_options = {
    sso_login_url: properties.loginurl,
    sso_logout_url: properties.logouturl,
    certificates: properties.certificate
  };
  let idp = new saml2.IdentityProvider(idp_options);
  return idp;
}

// Create service provider
var sp_options = {
  entity_id: `${ENTITYID}`,
  assert_endpoint: `${HOSTNAME}/assert`,
  //use out of the box
  private_key: fs.readFileSync("./SAMLkey.key").toString(),
  certificate: fs.readFileSync("./SAMLCertificate.pem").toString(),
  allow_unencrypted_assertion: true,
  nameid_format: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
  force_authn: true,
  auth_context: {
    comparison: "exact",
    class_refs: ["urn:oasis:names:tc:SAML:1.0:am:password"]
  }
};
var sp = new saml2.ServiceProvider(sp_options);

// Endpoint to retrieve metadata
app.get("/metadata.xml", function(req, res) {
  res.type('application/xml');
  res.send(sp.create_metadata());
});

// Starting point for login
app.get("/login", function(req, res) {
  //console.log(properties);
  sp.create_login_request_url(getidp(req), {}, function(err, login_url, request_id) {
    if (err != null)
      return res.sendStatus(500);
    res.redirect(login_url);
  });
});

// Assert endpoint for when login completes
app.post("/assert", function(req, res) {
  const sesh = req.session;
  const rawBody = req.body;
  var options = {
    request_body: req.body
  };
  sp.post_assert(getidp(req), options, function(err, saml_response) {
    console.log("Error", err);
    console.log("Response", saml_response);
    if (err != null)
      return res.sendStatus(500);

    // Save name_id and session_index for logout
    // Note:  In practice these should be saved in the user session, not globally.
    const uservars = saml_response.user;
    const attributes = uservars.attributes;
    // set session variables for UI
    sesh.group = uservars.attributes['groupIds']; //only send group attributes

    delete uservars.attributes['groupIds'];

    sesh.user = uservars; // only send user attribtues
    sesh.rawSAML = rawBody;
    // var SAMLResponse = sesh.rawSAML.SAMLResponse;
    // var b64string = SAMLResponse.replace(/(\r\n|\n|\r)/gm, "");
    // var buf = {
    //   result: Buffer.from(b64string, 'base64').toString()
    // }
    // console.log("Onetime", buf.result)
    console.log(`Hello ${uservars.name_id}!`);
    console.log(`Member of ${sesh.group}`);
    res.redirect("/");
  });
});

// Starting point for logout
app.get("/logout", function(req, res) {
  var options = {
    name_id: req.session.name_id,
    session_index: req.session.session_index
  };
  req.session.destroy();
  sp.create_logout_request_url(getidp(req), options, function(err, logout_url) {
    if (err != null)
      return res.send(500);
    res.redirect(logout_url);
  });
});

// An api endpoint that returns a short list of items
app.use('/api', apis);

// Render all React pages
app.get('/*', (req, res) => {
  const context = {};
  const app = ReactDOMServer.renderToString( <
    StaticRouter location = {
      req.url
    }
    context = {
      context
    } >
    <
    App / >
    <
    /StaticRouter>
  );

  const indexFile = path.resolve('./build/index.html');
  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Something went wrong:', err);
      return res.status(500).send('Oops, better luck next time!');
    }

    return res.send(
      data.replace('<div id="root"></div>', `<div id="root">${app}</div>`)
    );
  });
});

if (HTTPS) {
  https.createServer({
      key: fs.readFileSync('./server.key'),
      cert: fs.readFileSync('./server.cert')
    }, app)
    .listen(PORT, function() {
      console.log(`Example app listening on port ${PORT}! Go to https://localhost:${PORT}/`)
    })
} else {
  app.listen(PORT, () => {
    console.log(`😎 Server is listening on port ${PORT}! Go to http://localhost:${PORT}/`);
  });
}
