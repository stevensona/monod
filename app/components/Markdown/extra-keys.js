import { saveAs } from 'file-saver';


export const Tags = {
  STRONG: '**',
  ITALIC: '_',
};

function escapeRegExp(string) {
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}

export function addOrRemoveTag(tag, selection) {
  const regex = new RegExp(`^${escapeRegExp(tag)}([^]+?)${escapeRegExp(tag)}$`);
  const matches = selection.match(regex, 'gi');

  if (null !== matches) {
    return matches[1];
  }

  return `${tag}${selection}${tag}`;
}

const extraKeys = {
  'Cmd-Z': (cm) => {
    cm.undo();
  },
  'Cmd-B': (cm) => {
    cm.replaceSelection(addOrRemoveTag(Tags.STRONG, cm.getSelection()), 'around');
  },
  'Cmd-I': (cm) => {
    cm.replaceSelection(addOrRemoveTag(Tags.ITALIC, cm.getSelection()), 'around');
  },
  'Cmd-S': (cm) => {
    saveAs(new Blob([cm.getValue()], { type: 'text/plain' }), 'monod.md');
  },
};

export default extraKeys;
