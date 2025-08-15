import { useState, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { useDispatch } from "react-redux";
import { setCode } from "./codeSlice";
import { debounce } from "lodash"; // or create your own debounce

export default function EditorSection({ starterCode }) {
  const [code, setCodeLocal] = useState(starterCode || "");
  const dispatch = useDispatch();

  // Debounced Redux update (updates Redux 500ms after user stops typing)
  const debouncedDispatch = useCallback(
    debounce((value) => {
      dispatch(setCode(value));
    }, 500),
    [dispatch]
  );

  function handleEditorChange(value) {
    setCodeLocal(value);        // Update local state immediately
    debouncedDispatch(value);   // Update Redux after delay
  }

  return (
    <div style={{ flex: 1, minHeight: "500px" }}>
      <Editor
        height="100vh"
        defaultLanguage="javascript"
        defaultValue={starterCode}
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
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