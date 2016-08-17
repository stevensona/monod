import { connect } from 'react-redux';
import Sync from './presenter';
import { synchronize } from '../../modules/sync';


const mapStateToProps = (state) => {
  const app = state.app;

  return {
    offline: app.offline,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onRequestSync: () => {
    dispatch(synchronize());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Sync);
