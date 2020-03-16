var express = require('express');
const bodyParser = require('body-parser');
const app = express();
var router = express.Router();
const fs = require('fs');
const setup = process.env.REACT_APP_SHOWSETUP;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

router.get('/v1.0/config/status', function(req, res, next) {
  let uuid = req.query.uuid;

  if (uuid) {
  fs.readFile('properties-' + uuid + '.json', function(err, data) {
    if (!err) {
    var properties = JSON.parse(data);
    res.json({
      'status': (properties.loginurl || properties.logouturl || properties.certificate) ? true : false,
      'allowed': (setup != "false") ? true : false
    })
  } else {
    res.json({
      'status': false,
      'allowed': (setup != "false") ? true : false
    })
  }
  });
} else {
  fs.readFile('properties.json', function(err, data) {
    if (!err) {
    var properties = JSON.parse(data);
    res.json({
      'status': (properties.loginurl || properties.logouturl || properties.certificate) ? true : false,
      'allowed': (setup != "false") ? true : false
    })
  } else {
    res.json({
      'status': false,
      'allowed': (setup != "false") ? true : false
    })
  }
  });
}
})

router.get('/v1.0/config/properties', function(req, res, next) {
  let uuid = req.query.uuid;

  if (uuid) {
    fs.readFile('properties-' + uuid + '.json', function(err, data) {
      if (!err) {
      res.json({
        'code': '201',
        'message': JSON.parse(data),
        'error': false
      })
      console.log(JSON.parse(data))
    } else {
      res.json({
        'code': '201',
        'message': {
          loginurl: '',
          logouturl: '',
          certificate: ''
        }
      })
    }
    });
  } else {
    fs.readFile('properties.json', function(err, data) {
      if (!err) {
      res.json({
        'code': '201',
        'message': JSON.parse(data),
        'error': false
      })
      console.log(JSON.parse(data))
    } else {
      res.json({
        'code': '201',
        'message': {
          loginurl: '',
          logouturl: '',
          certificate: ''
        }
      })
    }
    });
  }
})

if (setup != "false") {
  router.post('/v1.0/config/properties', function(req, res, next) {
    const settings = req.body;
    console.log(settings)
    if (!settings.loginurl || !settings.logouturl || !settings.certificate) {
      var attrs = ((!settings.logouturl) ? "logout missing" : "logout received") + ', ' + ((!settings.loginurl) ? "login missing" : "login received") + ', ' + ((!settings.certificate) ? "certifcate missing" : "certificate received");
      res.json({
        'code': '402',
        'message': `You didn't send all the required attributes. Attributes: ${attrs}`
      })
    } else {
      let uuid = req.query.uuid;
      var setProperties = {
        "loginurl": settings.loginurl,
        "logouturl": settings.logouturl,
        "certificate": settings.certificate
      }
      let data = JSON.stringify(setProperties, null, 2);
      res.json({
        'code': '201',
        'message': 'Attempt to modify file made successfully. Call the GET endpoint to verify settings have been changed.',
        'nextCall': '/api/v1.0/config/properties',
        'nextMethod': "GET"
      })
      console.log('Successfully modified the configuration');
      if (uuid) {
        fs.writeFileSync('properties-' + uuid + '.json', data, (err) => {
          if (err) throw err;
          console.log('Notification inside write');
        });
      } else {
        fs.writeFileSync('properties.json', data, (err) => {
          if (err) throw err;
          console.log('Notification inside write');
        });
      }
    }
  })
}

router.get('/v1.0/session/attributes', function(req, res, next) {
  if (typeof req.session.user !== 'undefined') {
    var user = req.session.user;
    var SAMLResponse = req.session.rawSAML.SAMLResponse;
    var b64string = SAMLResponse.replace(/(\r\n|\n|\r)/gm, "");
    var buf = {
      result: Buffer.from(b64string, 'base64').toString()
    }
    user.assertion = buf;
    user.group = req.session.group;
    res.json(user)
  } else {
    var error = {
      errorCode: "402",
      errorMessage: "No user session found."
    }
    res.json(error)
  }
})

router.get('/v1.0/static/attributes', function(req, res, next) {
  var buf = {
    result: `<samlp:Response xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Destination="http://localhost:3006/assert" ID="FIMRSP_eefc245c-016f-18c6-b5e8-d62836174e29" InResponseTo="_a45f7e43ea6fa27e94261cc318bc63dd4e0f698e30" IssueInstant="2020-01-29T01:48:19Z" Version="2.0"><saml:Issuer Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">https://casesecurity.ice.ibmcloud.com/saml/sps/saml20ip/saml20</saml:Issuer><ds:Signature Id="uuideefc245d-016f-19d9-b203-d62836174e29"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><ds:Reference URI="#FIMRSP_eefc245c-016f-18c6-b5e8-d62836174e29"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>omWnXC9kMyxYAxVByBZ1ruDmsSTxFlqSEdAH1r/m3X4=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>tXyd6EU17UZ9Miih5cRtzY9/vXfi+aff+P6uU4d0iryapzwtb3jLnN//lGvgTVKDvBFsVJAZADkvOcUYq7UXk0RTTf5LsuSyxOKVUSSoCXjn88bRwMdtYKX4HUt6eHBYzI3izLtDw08yEAiT021ZxIiA3fbf2vbUp0uyycJlVC7x2jkmTWi0wGg9T6ndYoq31d0BDIkjteGs1Ixxg9se8KShUoKRO+4qlwwwHs9+HzsAM2PSwe94S+sVmOQDN2dQ9nXQYOx656SS+nwYjhq15xX5/mb83F5JsUSHOn9+2u8Ny0UwnmUm7hx7wcuXziw8HzZaXpI5Yzb0NPTcV4Lcqg==</ds:SignatureValue><ds:KeyInfo><ds:X509Data><ds:X509Certificate>MIIDOjCCAiKgAwIBAgIEfA/06DANBgkqhkiG9w0BAQsFADBfMQkwBwYDVQQGEwAxCTAHBgNVBAgTADEJMAcGA1UEBxMAMQkwBwYDVQQKEwAxCTAHBgNVBAsTADEmMCQGA1UEAxMdY2FzZXNlY3VyaXR5LmljZS5pYm1jbG91ZC5jb20wHhcNMTgwNzA3MTc1MTU5WhcNMjgwNzA0MTc1MTU5WjBfMQkwBwYDVQQGEwAxCTAHBgNVBAgTADEJMAcGA1UEBxMAMQkwBwYDVQQKEwAxCTAHBgNVBAsTADEmMCQGA1UEAxMdY2FzZXNlY3VyaXR5LmljZS5pYm1jbG91ZC5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDC2K9xO1IAzk/Jm/Kj9sIvxPDQi0JzHhwBa/Scn71sey8BQId9URAIy6psRKFe6kATznWiBMsDq5dMgimxUUYq5g6/73KYjp45AxQOUe1bd1OgS9YH26bCedpzZMZ8c0xVXmyDkpn+2I/KHhqQ5uUugTmZA1po6yQEPauQvgP8zCUOQe2x3enGT6usHr8pRa0GMnwvgQpoTg8G8xISeVxLxSOG7YhzDDs80Sf7XTh2Ow+ZYJ9eHnQk/5PC7+Qn5bpqRnsy2eGhfq0lqED/k3mJnbX1GmrBD+yKgrNMZCZE2JUXRv15bqoebnAgs2lOXUYpAMVfK9d5GtpG9BxTLvSLAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAEzwV120BI3QC4LBUMtrEXpTjqyBF/XwYk4o0hdJpC66JG98slaIa0CsJaCl0aNlvwUztA8FlbiZX2V/cqhN+N+faXq5+LuTzE6ngwheMt8XiGy93Soa2AyrfZQb1nfN27bLl9/5krCG6AuhJVddlElvFmE9yMYPGjMNlpdDwnzpktrhn798ZTv4vGXufg344O8hY+NhoW6kefGTLvko4LaRLHlxJJQSkYfF4yAC02xsy33m5lX1hPt7StRAhI3WA7owKXM4ZdeJLQBRdiC33OLDFO2lYH44LKfZcqg9tNVz8ByLB6coY6SdIFihtkdAGUyX4qigEuvcHF+HX7jxWDM=</ds:X509Certificate></ds:X509Data></ds:KeyInfo></ds:Signature><samlp:Status><samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/></samlp:Status><saml:Assertion ID="Assertion-uuideefc2453-016f-1ace-94da-d62836174e29" IssueInstant="2020-01-29T01:48:19Z" Version="2.0"><saml:Issuer Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">https://casesecurity.ice.ibmcloud.com/saml/sps/saml20ip/saml20</saml:Issuer><ds:Signature Id="uuideefc2454-016f-102d-b2a7-d62836174e29"><ds:SignedInfo><ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/><ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><ds:Reference URI="#Assertion-uuideefc2453-016f-1ace-94da-d62836174e29"><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/><ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/><ds:DigestValue>ttmGpCXAIVv7Ay02B2/71p67q8wRM9my2GeS1G9JbUI=</ds:DigestValue></ds:Reference></ds:SignedInfo><ds:SignatureValue>C8TG6nXQ351fJ3Ush5Yy2Q+zgSiwFFj0JHstX8qS57msI1ajC7c/OjBi8eCd4E4nj7894QyOBBC4+9ZwmRV8r7rw1lsOK8laGjzULzE2ttjfq0NeWRil7mOlUYeU7S2/Hq01TCdZfD/EQTzyICBZjWZAhO1tR+i42SIOs+lh+eQClB9xP/kYssYVAgBOHhg59TYteQ9Ho2J8zd05mtYC0lOGcWBVEVhKQWzgyljUMZ/a8Mc8bgBGjSGxJUN6dOtXjYUYFGY4uI50oSYci2+9iOCnmXl+8v/YsE2g1iW5pjJ/2Lxf1FNeIFNMOyYzVy6DOL7/WXLnZUskAfEJ0DvUFw==</ds:SignatureValue><ds:KeyInfo><ds:X509Data><ds:X509Certificate>MIIDOjCCAiKgAwIBAgIEfA/06DANBgkqhkiG9w0BAQsFADBfMQkwBwYDVQQGEwAxCTAHBgNVBAgTADEJMAcGA1UEBxMAMQkwBwYDVQQKEwAxCTAHBgNVBAsTADEmMCQGA1UEAxMdY2FzZXNlY3VyaXR5LmljZS5pYm1jbG91ZC5jb20wHhcNMTgwNzA3MTc1MTU5WhcNMjgwNzA0MTc1MTU5WjBfMQkwBwYDVQQGEwAxCTAHBgNVBAgTADEJMAcGA1UEBxMAMQkwBwYDVQQKEwAxCTAHBgNVBAsTADEmMCQGA1UEAxMdY2FzZXNlY3VyaXR5LmljZS5pYm1jbG91ZC5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDC2K9xO1IAzk/Jm/Kj9sIvxPDQi0JzHhwBa/Scn71sey8BQId9URAIy6psRKFe6kATznWiBMsDq5dMgimxUUYq5g6/73KYjp45AxQOUe1bd1OgS9YH26bCedpzZMZ8c0xVXmyDkpn+2I/KHhqQ5uUugTmZA1po6yQEPauQvgP8zCUOQe2x3enGT6usHr8pRa0GMnwvgQpoTg8G8xISeVxLxSOG7YhzDDs80Sf7XTh2Ow+ZYJ9eHnQk/5PC7+Qn5bpqRnsy2eGhfq0lqED/k3mJnbX1GmrBD+yKgrNMZCZE2JUXRv15bqoebnAgs2lOXUYpAMVfK9d5GtpG9BxTLvSLAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAEzwV120BI3QC4LBUMtrEXpTjqyBF/XwYk4o0hdJpC66JG98slaIa0CsJaCl0aNlvwUztA8FlbiZX2V/cqhN+N+faXq5+LuTzE6ngwheMt8XiGy93Soa2AyrfZQb1nfN27bLl9/5krCG6AuhJVddlElvFmE9yMYPGjMNlpdDwnzpktrhn798ZTv4vGXufg344O8hY+NhoW6kefGTLvko4LaRLHlxJJQSkYfF4yAC02xsy33m5lX1hPt7StRAhI3WA7owKXM4ZdeJLQBRdiC33OLDFO2lYH44LKfZcqg9tNVz8ByLB6coY6SdIFihtkdAGUyX4qigEuvcHF+HX7jxWDM=</ds:X509Certificate></ds:X509Data></ds:KeyInfo></ds:Signature><saml:Subject><saml:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">jshmoe@adamcase.me</saml:NameID><saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer"><saml:SubjectConfirmationData InResponseTo="_a45f7e43ea6fa27e94261cc318bc63dd4e0f698e30" NotOnOrAfter="2020-01-29T01:58:19Z" Recipient="http://localhost:3006/assert"/></saml:SubjectConfirmation></saml:Subject><saml:Conditions NotBefore="2020-01-29T01:38:19Z" NotOnOrAfter="2020-01-29T01:58:19Z"><saml:AudienceRestriction><saml:Audience>sample-saml-app</saml:Audience></saml:AudienceRestriction></saml:Conditions><saml:AuthnStatement AuthnInstant="2020-01-29T01:48:19Z" SessionIndex="uuideefa4406-016f-1433-90d7-d62836174e29" SessionNotOnOrAfter="2020-01-29T02:48:19Z"><saml:AuthnContext><saml:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:Password</saml:AuthnContextClassRef></saml:AuthnContext></saml:AuthnStatement><saml:AttributeStatement><saml:Attribute Name="userID" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"><saml:AttributeValue xsi:type="xs:string">jshmoe@adamcase.me</saml:AttributeValue></saml:Attribute><saml:Attribute Name="given_name" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"><saml:AttributeValue xsi:type="xs:string">Joe</saml:AttributeValue></saml:Attribute><saml:Attribute Name="AWS_Team" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"><saml:AttributeValue xsi:type="xs:string">Not Imported</saml:AttributeValue></saml:Attribute><saml:Attribute Name="AWS_TransitiveKeyTags" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"><saml:AttributeValue xsi:type="xs:string">teams</saml:AttributeValue></saml:Attribute><saml:Attribute Name="mobile_number" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"><saml:AttributeValue xsi:type="xs:string">15126534812</saml:AttributeValue></saml:Attribute><saml:Attribute Name="tenantId" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"><saml:AttributeValue xsi:type="xs:string">casesecurity.ice.ibmcloud.com</saml:AttributeValue></saml:Attribute><saml:Attribute Name="name" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"><saml:AttributeValue xsi:type="xs:string">Joe Shmoe</saml:AttributeValue></saml:Attribute><saml:Attribute Name="O365SourceAnchor" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"><saml:AttributeValue xsi:type="xs:string">Not Imported</saml:AttributeValue></saml:Attribute><saml:Attribute Name="AWS_Role" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"><saml:AttributeValue xsi:type="xs:string">Not Imported</saml:AttributeValue></saml:Attribute><saml:Attribute Name="preferred_username" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"><saml:AttributeValue xsi:type="xs:string">jshmoe@adamcase.me</saml:AttributeValue></saml:Attribute><saml:Attribute Name="realmName" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"><saml:AttributeValue xsi:type="xs:string">casesecurity.ice.ibmcloud.com</saml:AttributeValue></saml:Attribute><saml:Attribute Name="AWS_Project" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"><saml:AttributeValue xsi:type="xs:string">Not Imported</saml:AttributeValue></saml:Attribute><saml:Attribute Name="uid" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"><saml:AttributeValue xsi:type="xs:string">50G9VAQ8BM</saml:AttributeValue></saml:Attribute><saml:Attribute Name="JIT_realmName" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"><saml:AttributeValue xsi:type="xs:string">casesecurity.ice.ibmcloud.com</saml:AttributeValue></saml:Attribute><saml:Attribute Name="groupIds" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"><saml:AttributeValue xsi:type="xs:string">Application-GSuite</saml:AttributeValue><saml:AttributeValue xsi:type="xs:string">admin</saml:AttributeValue><saml:AttributeValue xsi:type="xs:string">admin</saml:AttributeValue><saml:AttributeValue xsi:type="xs:string">application owners</saml:AttributeValue><saml:AttributeValue xsi:type="xs:string">Application - Gmail</saml:AttributeValue><saml:AttributeValue xsi:type="xs:string">na-ibm-sales</saml:AttributeValue><saml:AttributeValue xsi:type="xs:string">developer</saml:AttributeValue><saml:AttributeValue xsi:type="xs:string">disabled</saml:AttributeValue></saml:Attribute><saml:Attribute Name="email" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"><saml:AttributeValue xsi:type="xs:string">jshmoe@adamcase.me</saml:AttributeValue></saml:Attribute><saml:Attribute Name="emailAddress" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"><saml:AttributeValue xsi:type="xs:string">jshmoe@adamcase.me</saml:AttributeValue></saml:Attribute><saml:Attribute Name="fancy_name" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"><saml:AttributeValue xsi:type="xs:string">Joe</saml:AttributeValue></saml:Attribute><saml:Attribute Name="family_name" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic"><saml:AttributeValue xsi:type="xs:string">Shmoe</saml:AttributeValue></saml:Attribute></saml:AttributeStatement></saml:Assertion></samlp:Response>`
  }
  json = {
    name_id: 'jshmoe@adamcase.me',
    session_index: 'uuideea810e2-016f-10b5-9d82-d62836174e29',
    session_not_on_or_after: '2020-01-29T01:16:33Z',
    assertion: buf,
    attributes: {
      userID: ['jshmoe@adamcase.me'],
      given_name: ['Joe'],
      AWS_Team: ['Not Imported'],
      AWS_TransitiveKeyTags: ['teams'],
      mobile_number: ['15126534812'],
      tenantId: ['casesecurity.ice.ibmcloud.com'],
      name: ['Joe Shmoe'],
      O365SourceAnchor: ['Not Imported'],
      AWS_Role: ['Not Imported'],
      preferred_username: ['jshmoe@adamcase.me'],
      realmName: ['casesecurity.ice.ibmcloud.com'],
      AWS_Project: ['Not Imported'],
      uid: ['50G9VAQ8BM'],
      groupIds: ['Application-GSuite',
        'admin',
        'admin',
        'application owners',
        'Application - Gmail',
        'na-ibm-sales',
        'developer',
        'disabled'
      ],
      JIT_realmName: ['casesecurity.ice.ibmcloud.com'],
      email: ['jshmoe@adamcase.me'],
      emailAddress: ['jshmoe@adamcase.me'],
      fancy_name: ['Joe'],
      family_name: ['Shmoe']
    }
  }
  res.json(json)
})

router.get('/v1.0/static/session', function(req, res, next) {
  res.json({
    session: 'active'
  })
})

router.get('/v1.0/session/active', function(req, res, next) {
  if (typeof req.session.user !== 'undefined') {
    res.json({
      session: 'active'
    })
  } else {
    res.json({
      session: 'inactive'
    })
  }
})

router.get('/v1.0/session/assertion', function(req, res, next) {
  if (typeof req.session.rawSAML !== 'undefined') {
    var SAMLResponse = req.session.rawSAML.SAMLResponse;
    var b64string = SAMLResponse.replace(/(\r\n|\n|\r)/gm, "");
    var buf = {
      result: Buffer.from(b64string, 'base64').toString()
    }
    res.json(buf)
  } else {
    var error = {
      errorCode: "402",
      errorMessage: "No user session found."
    }
    res.json(error)
  }
})

router.get('/v1.0/config/saml', function(req, res, next) {
  res.json({
    'entityid': process.env.REACT_APP_ENTITYID,
    'acs': process.env.REACT_APP_HOSTNAME + '/assert',
    'ssotrigger': process.env.REACT_APP_HOSTNAME + '/login'
  })
})

module.exports = router;
