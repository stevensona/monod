import { connect } from 'react-redux';
import Editor from './presenter';


const mapStateToProps = (state) => {
  const documents = state.documents;

  return {
    loaded: documents.loaded,
    content: documents.current.content,
    template: documents.current.template,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onUpdateContent: () => {},
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
