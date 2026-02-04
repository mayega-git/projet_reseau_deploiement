/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useRef, useEffect } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  DraftEditorCommand,
  DraftHandleValue,
  DraftBlockType,
  convertToRaw,
} from 'draft-js';
import Toolbar from './Toolbar/Toolbar';
import './DraftEditor.css';

// ✅ Define Props Interface
interface DraftEditorProps {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  placeholder?: string;
}

// ✅ DraftEditor Component
const DraftEditor: React.FC<DraftEditorProps> = ({
  editorState,
  setEditorState,
  placeholder = 'Write your blog here...',
}) => {
  const editorRef = useRef<Editor | null>(null);

  // ✅ Focus Editor on Mount
  useEffect(() => {
    focusEditor();
  }, []);

  const focusEditor = () => {
    if (editorRef.current) editorRef.current.focus();
  };

  // ✅ Handle Key Commands
  const handleKeyCommand = (
    command: DraftEditorCommand,
    editorState: EditorState
  ): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  // ✅ Custom Inline Styles
  const styleMap: Record<string, React.CSSProperties> = {
    CODE: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2,
    },
    HIGHLIGHT: { backgroundColor: '#F7A5F7' },
    UPPERCASE: { textTransform: 'uppercase' },
    LOWERCASE: { textTransform: 'lowercase' },
    CODEBLOCK: {
      fontFamily: '"fira-code", "monospace"',
      fontSize: 'inherit',
      background: '#ffeff0',
      fontStyle: 'italic',
      lineHeight: 1.5,
      padding: '0.3rem 0.5rem',
      borderRadius: '0.2rem',
    },
    SUPERSCRIPT: { verticalAlign: 'super', fontSize: '80%' },
    SUBSCRIPT: { verticalAlign: 'sub', fontSize: '80%' },
  };

  // ✅ Block-Level Styles
  const myBlockStyleFn = (contentBlock: { getType: () => DraftBlockType }) => {
    switch (contentBlock.getType()) {
      case 'blockQuote':
        return 'superFancyBlockquote';
      case 'leftAlign':
        return 'leftAlign';
      case 'rightAlign':
        return 'rightAlign';
      case 'centerAlign':
        return 'centerAlign';
      case 'justifyAlign':
        return 'justifyAlign';
      case 'header-one':
        return 'editor-h1';
      case 'header-two':
        return 'editor-h2';
      case 'header-three':
        return 'editor-h3';
      case 'header-four':
        return 'editor-h4';
      case 'header-five':
        return 'editor-h5';
      case 'header-six':
        return 'editor-h6';
      default:
        return '';
    }
  };

  return (
    <div className="editor-wrapper" onClick={focusEditor}>
      {/* ✅ Toolbar */}
      <Toolbar editorState={editorState} setEditorState={setEditorState} />

      {/* ✅ Draft.js Editor */}
      <div className="editor-container">
        <Editor
          ref={editorRef}
          placeholder={placeholder}
          handleKeyCommand={handleKeyCommand}
          editorState={editorState}
          customStyleMap={styleMap}
          blockStyleFn={myBlockStyleFn}
          onChange={(newEditorState) => {
            // console.log(convertToRaw(newEditorState.getCurrentContent()));
            setEditorState(newEditorState);
          }}
        />
      </div>
    </div>
  );
};

export default DraftEditor;
