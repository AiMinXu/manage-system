import React, { useEffect, useState } from 'react';
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraftjs from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import ContentState from "draft-js/lib/ContentState";
import EditorState from "draft-js/lib/EditorState";
const NewsEditor = (props) => {
  const [editorState, setEditorState] = useState("")

  //副作用html转换为富文本内容
  useEffect(() => {
    // console.log(props.content);
    const html = props.content;
    if (html === undefined) return;

    const contentBlock = htmlToDraftjs(html);
    //是否有效
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  }, [props.content]);

  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={(editorState) => setEditorState(editorState)}
        onBlur={() => {
          props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        }}
      />
    </div>
  );
};

export default NewsEditor;
