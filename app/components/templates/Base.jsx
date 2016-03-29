import { PropTypes, Component } from 'react';
import merge from 'deepmerge';

const { array, object } = PropTypes;

/**
 * Base template
 */
export default class Base extends Component {

  getDefaultData() {
    // Required
    // Should return Object-serialized data
    throw 'Not implemented';
  }

  cleanData(data) {
    // Clean input data to avoid undefined or null object properties
    // This avoids preview crash when trying to access null.<property>
    for (let p in data) {
      if (data.hasOwnProperty(p) && data[p] === null) {
        delete data[p];
      }
    }
    return data;
  }

  getData() {
    return merge(
      this.getDefaultData(),
      this.cleanData(this.props.data)
    );
  }
}

Base.propTypes = {
  content: array.isRequired,
  data: object.isRequired
}
