import React from 'react';
import {
  ProgressStep, ProgressIndicator, Tooltip
} from 'carbon-components-react';


const SetupProgress = (props) => {
  return (
    <ProgressIndicator currentIndex={props.step} className="config-setup">
      <ProgressStep
        description="Step 1: Set the URLs from your identity provider"
        label="Set your URLs"
        renderLabel={() => (
            <Tooltip
              direction="bottom"
              showIcon={false}
              triggerClassName={`bx--progress-label`}
              triggerText={'Set your URLs'}
              tooltipId="tooltipId-0">
              <p>In this step, provide us with your Identity Provider's information.</p>
            </Tooltip>
          )}
      />
      <ProgressStep
        description="Step 2: Getting started with Carbon Design System"
        label="Get our metadata"
        renderLabel={() => (
            <Tooltip
              direction="bottom"
              showIcon={false}
              triggerClassName={`bx--progress-label`}
              triggerText={'Get our metadata'}
              tooltipId="tooltipId-1">
              <p>In this step, you'll get our app's SAML information which allows you to make a trust connection on your Identity Provider.</p>
            </Tooltip>
          )}
      />
      <ProgressStep
        description="Step 3: Finish the configuration and save"
        label="Wrap Up"
        renderLabel={() => (
            <Tooltip
              direction="bottom"
              showIcon={false}
              triggerClassName={`bx--progress-label`}
              triggerText={'Wrap Up'}
              tooltipId="tooltipId-2">
              <p>Configuration is complete, now try to log in.</p>
            </Tooltip>
          )}
      />
    </ProgressIndicator>
  );
};
export default SetupProgress;
