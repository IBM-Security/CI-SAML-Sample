import React from 'react';
import { Link } from 'carbon-components-react'

const Footer = props => (
  <section className={`bx--row ${props.className} info-section`}>
    <div className="bx--col-md-8 bx--col-lg-8 bx--col-xlg-8">
      <h3 className="info-section__heading">{props.text}
        <Link
          href="https://www.ibm.com/support/knowledgecenter/SSCT62/com.ibm.iamservice.doc/tasks/t_config_sso_idp.html"
          className="footer-link"
        >
          {props.linktext}
        </Link>
      </h3>

    </div>
  </section>
);

export default Footer;
