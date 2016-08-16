import { connect } from 'react-redux';
import Editor from './presenter';
import { updateContent } from '../../modules/documents';


const mapStateToProps = (state) => {
  const documents = state.documents;

  return {
    loaded: documents.loaded,
    content: documents.current.get('content'),
    template: documents.current.get('template'),
    forceUpdate: documents.forceUpdate,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onUpdateContent: (content) => {
    dispatch(updateContent(content));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
