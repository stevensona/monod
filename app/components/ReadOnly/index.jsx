import React, { PropTypes } from 'react';
import Loader from 'react-loader';
import Preview from '../Preview';


const ReadOnly = (props) =>
  <div className="editor">
    <Loader
      loaded={props.loaded}
    />
    <Preview
      pos={-1}
      raw={props.content}
      template={props.template}
    />
  </div>
;

ReadOnly.propTypes = {
  loaded: PropTypes.bool.isRequired,
  content: PropTypes.string.isRequired,
  template: PropTypes.string.isRequired,
};

export default ReadOnly;
