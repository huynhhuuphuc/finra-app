import { DomEditor, IDomEditor, SlateTransforms } from '@wangeditor/editor';
function withAudio<T extends IDomEditor>(editor: T) {
  const { isVoid, normalizeNode } = editor;
  const newEditor = editor;

  // -- Override isVoid
  newEditor.isVoid = (elem) => {
    const type = DomEditor.getNodeType(elem);
    if (type === 'audio') return true;
    return isVoid(elem);
  };

  // -- Override normalize
  newEditor.normalizeNode = ([node, path]) => {
    const type = DomEditor.getNodeType(node);
    if (type !== 'audio') {
      // Not an audio node — run default normalizeNode
      return normalizeNode([node, path]);
    }

    // Editor top-level nodes
    const topLevelNodes = newEditor.children || [];

    // --------------------- audio must be followed by a p / header / blockquote (otherwise text cannot be entered after it) ---------------------
    const nextNode = topLevelNodes[path[0] + 1] || {};
    const nextNodeType = DomEditor.getNodeType(nextNode);
    if (
      nextNodeType !== 'paragraph' &&
      nextNodeType !== 'blockquote' &&
      !nextNodeType.startsWith('header')
    ) {
      // Node after audio is not p or header — insert an empty p
      const p = { type: 'paragraph', children: [{ text: '' }] };
      const insertPath = [path[0] + 1];
      SlateTransforms.insertNodes(newEditor, p, {
        at: insertPath, // Insert after the audio node
      });
    }
  };

  return newEditor;
}

export { withAudio };
