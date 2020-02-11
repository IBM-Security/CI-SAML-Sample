import React from 'react';

const SetupHeader = (props) => {
  return (
    <div className="bx--col-lg-16">
      <div className="setup-description">
        <h4>{props.title}</h4>
        <p>{props.description}</p>
      </div>
    </div>
  );
};
export default SetupHeader;
