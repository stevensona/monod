import { connect } from 'react-redux';
import Toolbar from './presenter';
import { updateTemplate } from '../../modules/documents';


const mapStateToProps = (state) => {
  const documents = state.documents;

  return {
    template: documents.current.template,
    enableShareModalButton: '' !== window.location.pathname.slice(1),
  };
};

const mapDispatchToProps = dispatch => ({
  onUpdateTemplate: (event) => {
    const template = event.target.value;

    dispatch(updateTemplate(template));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
