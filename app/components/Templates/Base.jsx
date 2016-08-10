/* eslint no-throw-literal: 0 */
import { PropTypes, Component } from 'react';
import merge from 'deepmerge';


export default class Base extends Component {

  getDefaultData() {
    // Required
    // Should return Object-serialized data
    throw 'Not implemented';
  }

  getData() {
    return merge(
      this.getDefaultData(),
      this.cleanData(this.props.data)
    );
  }

  cleanData(data) {
    const cleaned = Object.assign({}, data);
    // Clean input data to avoid undefined or null object properties
    // This avoids preview crash when trying to access null.<property>
    for (const p in data) { // eslint-disable-line no-restricted-syntax
      if (data.hasOwnProperty(p) && null === data[p]) { // eslint-disable-line no-prototype-builtins
        delete cleaned[p];
      }
    }

    return cleaned;
  }
}

Base.propTypes = {
  content: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired,
};
