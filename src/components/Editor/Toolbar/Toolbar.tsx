/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { JSX } from 'react';
import { EditorState, RichUtils } from 'draft-js';
import {
  Bold,
  Italic,
  Underline,
  Highlighter,
  Strikethrough,
  Superscript,
  Subscript,
  Code,
  Quote,
  List,
  ListOrdered,
  ChevronUp,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

// ✅ Define TypeScript Interface for Props
interface ToolbarProps {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}

// ✅ Define Interface for Toolbar Tools
interface ToolType {
  label: string;
  style: string;
  icon?: JSX.Element;
  method: 'inline' | 'block';
}

// ✅ Define Toolbar Tools Array
const tools: ToolType[] = [
  { label: 'bold', style: 'BOLD', icon: <Bold size={18} />, method: 'inline' },
  {
    label: 'italic',
    style: 'ITALIC',
    icon: <Italic size={18} />,
    method: 'inline',
  },
  {
    label: 'underline',
    style: 'UNDERLINE',
    icon: <Underline size={18} />,
    method: 'inline',
  },
  {
    label: 'highlight',
    style: 'HIGHLIGHT',
    icon: <Highlighter size={18} />,
    method: 'inline',
  },
  {
    label: 'strike-through',
    style: 'STRIKETHROUGH',
    icon: <Strikethrough size={18} />,
    method: 'inline',
  },
  {
    label: 'Superscript',
    style: 'SUPERSCRIPT',
    icon: <Superscript size={18} />,
    method: 'inline',
  },
  {
    label: 'Subscript',
    style: 'SUBSCRIPT',
    icon: <Subscript size={18} />,
    method: 'inline',
  },
  {
    label: 'Monospace',
    style: 'CODE',
    icon: <Code size={18} />,
    method: 'inline',
  },
  {
    label: 'Blockquote',
    style: 'blockQuote',
    icon: <Quote size={18} />,
    method: 'block',
  },
  {
    label: 'Unordered-List',
    style: 'unordered-list-item',
    icon: <List size={18} />,
    method: 'block',
  },
  {
    label: 'Ordered-List',
    style: 'ordered-list-item',
    icon: <ListOrdered size={18} />,
    method: 'block',
  },
  {
    label: 'Code Block',
    style: 'CODEBLOCK',
    icon: <Code size={18} />,
    method: 'inline',
  },
  {
    label: 'Uppercase',
    style: 'UPPERCASE',
    icon: <ChevronUp size={18} />,
    method: 'inline',
  },
  {
    label: 'Lowercase',
    style: 'LOWERCASE',
    icon: <ChevronDown size={18} />,
    method: 'inline',
  },
  {
    label: 'Left',
    style: 'leftAlign',
    icon: <AlignLeft size={18} />,
    method: 'block',
  },
  {
    label: 'Center',
    style: 'centerAlign',
    icon: <AlignCenter size={18} />,
    method: 'block',
  },
  {
    label: 'Right',
    style: 'rightAlign',
    icon: <AlignRight size={18} />,
    method: 'block',
  },
  { label: 'H1', style: 'header-one', method: 'block' },
  { label: 'H2', style: 'header-two', method: 'block' },
  { label: 'H3', style: 'header-three', method: 'block' },
  { label: 'H4', style: 'header-four', method: 'block' },
  { label: 'H5', style: 'header-five', method: 'block' },
  { label: 'H6', style: 'header-six', method: 'block' },
];

// ✅ Define Toolbar Component
const Toolbar: React.FC<ToolbarProps> = ({ editorState, setEditorState }) => {
  // ✅ Apply Formatting Style
  const applyStyle = (
    e: React.MouseEvent,
    style: string,
    method: 'inline' | 'block'
  ) => {
    e.preventDefault();
    setEditorState(
      method === 'block'
        ? RichUtils.toggleBlockType(editorState, style)
        : RichUtils.toggleInlineStyle(editorState, style)
    );
  };

  // ✅ Check If Style is Active
  const isActive = (style: string, method: 'inline' | 'block'): boolean => {
    if (method === 'block') {
      const selection = editorState.getSelection();
      const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
      return blockType === style;
    } else {
      return editorState.getCurrentInlineStyle().has(style);
    }
  };

  return (
    <div className="toolbar-grid">
      {tools.map((item, idx) => (
        <button
          key={`${item.label}-${idx}`}
          title={item.label}
          onClick={(e) => applyStyle(e, item.style, item.method)}
          onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
          style={{
            color: isActive(item.style, item.method)
              ? 'rgba(0, 0, 0, 1)'
              : 'rgba(0, 0, 0, 0.3)',
          }}
        >
          {item.icon || item.label}
        </button>
      ))}
    </div>
  );
};

export default Toolbar;
