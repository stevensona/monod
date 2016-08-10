import { connect } from 'react-redux';
import Toolbar from './presenter';


const mapStateToProps = (state) => {
  const documents = state.documents;

  return {
    template: documents.current.template,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onUpdateTemplate: () => {},
  onTogglePresentationMode: () => {},
});

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
