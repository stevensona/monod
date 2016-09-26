import { connect } from 'react-redux';
import Editor from './presenter';
import {
  updateContent,
  toggleTaskListItem,
} from '../../modules/documents';


const mapStateToProps = (state) => {
  const documents = state.documents;

  return {
    loaded: documents.loaded,
    content: documents.current.get('content'),
    template: documents.current.get('template'),
    forceUpdate: documents.forceUpdate,
  };
};

const mapDispatchToProps = dispatch => ({
  onUpdateContent: (content) => {
    dispatch(updateContent(content));
  },
  onClickCheckbox: (index) => {
    const idx = parseInt(index, 10);

    if (!isNaN(idx)) {
      dispatch(toggleTaskListItem(idx));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
