import React, { useState } from 'react'
import Editor from "@monaco-editor/react";
import styles from './CodingScreen.module.css';

const EditorSection = ({starterCode}) => {
  const [code, setCode] = useState("// Write your code here");

  return (
      <div className={styles.editorSection}>
        <Editor
          height="90vh"
          language="javascript"
          value={starterCode}
          onChange={value => setCode(value)}
          className={styles.editor}
        />
      </div>
  )
}

export default EditorSection