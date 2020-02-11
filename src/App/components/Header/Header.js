import React from 'react';
import { Link } from 'react-router-dom';
import {
  Header,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
} from 'carbon-components-react/lib/components/UIShell';

const IBMHeader = () => (
  <Header aria-label="IBM Security Verify">
    <SkipToContent />
    <HeaderName element={Link} to="/" prefix="IBM">
      Security Verify
    </HeaderName>
  </Header>
);
export default IBMHeader;
