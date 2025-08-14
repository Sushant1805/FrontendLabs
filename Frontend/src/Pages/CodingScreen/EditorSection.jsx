// pages/EditorSection.jsx
import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function EditorSection({ starterCode }) {
  const [code, setCode] = useState(starterCode || "");

  function handleEditorChange(value) {
    console.log(code)
    setCode(value);
  }

  return (
    <div style={{ flex: 1, minHeight: "500px" }}>
      <Editor
        height="100vh"
        defaultLanguage="javascript" // Change dynamically if needed
        defaultValue={starterCode}
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark" // Try "light", "hc-black", or custom theme
        options={{
          fontSize: 16,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
