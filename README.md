## Sample SAML Application
### For development test purposes only

Paths:
- `/login` performs an SP initiated login
- `/logout` logs the user out of the session and returns them to the IdP logout url
- `/profile` is an authenticated page, it will not render unless you're logged in
- `/setup` is a future page that will allow you to switch between IdPs easily. This currently does not work.

To configure:
1. Set .env variables
The Login/Logout URLs should come from your identity provider. The certificate must be in a string format.
```SASS_PATH="node_modules"
SKIP_PREFLIGHT_CHECK=true
LOGINURL=https://yourtenant.ice.ibmcloud.com/saml/sps/saml20ip/saml20/login
LOGOUTURL=https://yourtenant.ice.ibmcloud.com/idaas/mtfim/sps/idaas/logout
CERTIFICATE=MIIDOjCCAiKgAwIBAgIEfA......SdIFihtkdAGUyX4qigEuvcHF+HX7jxWDM=
```

2. Run `npm install` to obtain all packages
3. Run `npm start` to start the SAML Service provider
4. Configure your IdP to trust this application using the following settings:
```
Assertion URL: http://localhost:3006/assert
NameID format: urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress
AuthnClassRef: urn:oasis:names:tc:SAML:1.0:am:password
Encryption: None
Signed: Yes
```
5. Go to http://localhost:3006 in your browser and click login
