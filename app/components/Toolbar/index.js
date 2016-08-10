import { connect } from 'react-redux';
import Toolbar from './presenter';
import { updateTemplate } from '../../modules/documents';


const mapStateToProps = (state) => {
  const documents = state.documents;

  return {
    template: documents.current.template,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onUpdateTemplate: (event) => {
    const template = event.target.value;

    dispatch(updateTemplate(template));
  },
  onTogglePresentationMode: () => {},
});

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
