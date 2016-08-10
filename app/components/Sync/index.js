import { connect } from 'react-redux';
import Sync from './presenter';


const mapDispatchToProps = (dispatch) => ({
  onRequestSync: () => {},
});

export default connect(null, mapDispatchToProps)(Sync);
