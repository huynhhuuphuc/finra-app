import Validator from '@likg/validator';
import {
  i18nChangeLanguage,
  IDomEditor,
  IEditorConfig,
  IToolbarConfig,
  SlateTransforms,
} from '@wangeditor/editor';

import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import '@wangeditor/editor/dist/css/style.css';
import { App } from 'antd';
import React, { memo, useEffect, useImperativeHandle, useState } from 'react';
import hoverbarKeys from './configs/hoverbarKeys';
import { fontFamily, fontSize } from './configs/menuConfs';
import toolbarKeys from './configs/toolbarKeys';
import { EventType } from './constants';
import './elements';
import './index.less';
import './menus';

// Default language is Chinese — switch to English before creating any editor
i18nChangeLanguage('en');

export interface UploadProps {
  type: 'AUDIO' | 'VIDEO' | 'IMAGE';
  file: File;
  next: (url: string) => void;
}

type LimitType = {
  /** File type */
  accept: string;
  /** Max file size in MB */
  size?: number;
};
interface IProps {
  /** Default value */
  value?: string;
  /** Max length */
  maxLength?: number;
  /** Placeholder text */
  placeholder?: string;
  /** Read-only mode (hide toolbar, disable editing) */
  readOnly?: boolean;
  /** Editor height */
  height?: number | string;
  /** Video format limit */
  videoLimit?: LimitType;
  /** Audio format limit */
  audioLimit?: LimitType;
  /** Image format limit */
  imageLimit?: LimitType;
  /** Toolbar keys */
  toolbarKeys?: Array<
    | string
    | {
        key: string;
        title: string;
        iconSvg: any;
        menuKeys: string[];
      }
  >;
  /** Excluded toolbar keys */
  excludeKeys?: string[];
  onChange?: (value: string) => void;
  /** Mobile preview */
  onPreview?: (htmlString: string) => void;
  /** File upload */
  onUploadFile?: (options: UploadProps) => void;
}
export interface EditorWangRefs {
  /** Clear content */
  clear: () => void;
  /** Set content */
  setContent: (htmlString: string) => void;
  /** Get text */
  getText: () => string;
}

type InsertImageFnType = (url: string, alt: string, href: string) => void;
type InsertVideoFnType = (url: string, poster: string) => void;

const EditorWang = React.forwardRef<EditorWangRefs | undefined, IProps>(
  (props, refs) => {
    const {
      value,
      placeholder = 'Please enter content...',
      maxLength = 10000,
      readOnly = false,
      height = 300,
      videoLimit = { accept: '.mp4', size: 60, ...(props.videoLimit || {}) },
      audioLimit = { accept: '.mp3', size: 60, ...(props.audioLimit || {}) },
      imageLimit = {
        accept: '.jpg, .jpeg, .png, .webp, .gif, .bmp',
        size: 20,
        ...(props.imageLimit || {}),
      },
      excludeKeys = [],
      onChange,
      onPreview,
      onUploadFile,
    } = props;
    const { message, modal } = App.useApp();

    // -- state
    const [editor, setEditor] = useState<IDomEditor | null>(null);

    // -- refs
    useImperativeHandle(refs, () => ({
      clear: () => {
        editor?.clear();
      },
      setContent: (htmlString: string) => {
        editor?.setHtml(htmlString);
      },
      getText: () => {
        return editor?.getText() || '';
      },
    }));

    // -- methods
    const checkLimit = (limit: LimitType, file: File) => {
      // 1. Validate file extension
      if (
        !Validator.checkFile({ type: 'extension', file, accept: limit.accept })
      ) {
        message.warning(`Only ${limit.accept} files are supported!`);
        return false;
      }
      // 2. Validate file size
      if (!Validator.checkFile({ type: 'size', file, maxSize: limit.size! })) {
        message.warning(`File size cannot exceed ${limit.size!} MB!`);
        return false;
      }

      return true;
    };

    // -- events
    const __onClearContent = (editor: IDomEditor) => {
      modal.confirm({
        title: 'Are you sure you want to clear the content?',
        content: 'Cleared content cannot be recovered. Please save it first!',
        cancelText: 'Cancel',
        okText: 'OK',
        onOk: () => editor.clear(),
      });
    };
    const __onPreview = (editor: IDomEditor) => {
      if (!editor.getText()) {
        message.info('Content is empty, cannot preview');
        return;
      }
      if (onPreview) {
        onPreview(editor.getHtml());
      }
    };
    const __onReplaceImage = (editor: IDomEditor, file: File) => {
      if (onUploadFile) {
        if (!checkLimit(imageLimit, file)) return;
        onUploadFile({
          type: 'IMAGE',
          file,
          next: (url: string) => {
            // -- Remove the currently selected node
            SlateTransforms.removeNodes(editor);
            // -- Insert a new node
            const node = {
              type: 'paragraph',
              children: [
                { text: '' },
                {
                  type: 'image',
                  src: url,
                  href: 'href',
                  alt: 'alt',
                  style: {},
                  children: [{ text: '' }],
                },
                { text: '' },
              ],
            };
            editor.insertNode(node);
          },
        });
      }
    };
    const __onUploadAudio = (editor: IDomEditor, file: File) => {
      if (onUploadFile) {
        if (!checkLimit(audioLimit, file)) return;
        onUploadFile({
          type: 'AUDIO',
          file,
          next(url) {
            const audioResume = {
              type: 'audio',
              src: url,
              children: [{ text: '' }],
            };
            editor.insertNode(audioResume);
          },
        });
      }
    };

    // -- Toolbar config
    const toolbarConfig: Partial<IToolbarConfig> = {
      toolbarKeys: props.toolbarKeys || toolbarKeys,
      excludeKeys,
    };

    // -- Editor config
    const editorConfig: Partial<IEditorConfig> = {
      placeholder,
      autoFocus: false,
      maxLength,
      readOnly,
      scroll: true,
      hoverbarKeys: readOnly ? {} : hoverbarKeys,
      MENU_CONF: {
        fontSize,
        fontFamily,
        uploadImage: {
          async customUpload(file: File, insertFn: InsertImageFnType) {
            if (!checkLimit(imageLimit, file)) return;
            if (!onUploadFile) {
              message.warning(
                'Chưa cấu hình onUploadFile — không thể upload ảnh',
              );
              return;
            }
            onUploadFile({
              type: 'IMAGE',
              file,
              next: (url: string) => {
                insertFn(url, 'alt', 'href');
              },
            });
          },
        },
        uploadVideo: {
          async customUpload(file: File, insertFn: InsertVideoFnType) {
            if (!checkLimit(videoLimit, file)) return;
            if (!onUploadFile) {
              message.warning(
                'Chưa cấu hình onUploadFile — không thể upload video',
              );
              return;
            }
            onUploadFile({
              type: 'VIDEO',
              file,
              next: (url: string) => {
                insertFn(url, '');
              },
            });
          },
        },
      },
    };

    // Destroy editor promptly — important!
    useEffect(() => {
      return () => {
        if (editor === null) return;
        editor.destroy();
        setEditor(null);
      };
    }, [editor]);

    /**********************
     ** Layout
     **********************/
    return (
      <div className="lg-editor-wang">
        {/* Toolbar */}
        {!readOnly && (
          <Toolbar
            editor={editor}
            defaultConfig={toolbarConfig}
            mode="default"
            style={{ borderBottom: '1px solid #ccc' }}
          />
        )}
        {/* Editor */}

        <Editor
          defaultConfig={editorConfig}
          value={value}
          mode="default"
          style={{ overflowY: 'hidden', height }}
          onCreated={(editor: IDomEditor) => {
            setEditor(editor);
            console.log(editor.getAllMenuKeys());
            // -- Custom events
            editor.on(EventType.PREVIEW, () => __onPreview(editor));
            editor.on(EventType.CLEAR_CONTENT, () => __onClearContent(editor));
            editor.on(EventType.REPLACE_IMAGE, (file) =>
              __onReplaceImage(editor, file),
            );
            editor.on(EventType.UPLOAD_AUDIO, (file) =>
              __onUploadAudio(editor, file),
            );
          }}
          onChange={(editor: IDomEditor) => {
            const htmlString = editor.getHtml();
            onChange && onChange(htmlString);
          }}
        />
      </div>
    );
  },
);

export default memo(EditorWang);
