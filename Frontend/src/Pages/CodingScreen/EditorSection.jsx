import { useState, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { useDispatch } from "react-redux";
import { setCode } from "./codeSlice";
import { debounce } from "lodash"; // or create your own debounce

export default function EditorSection({ starterCode }) {
  const [code, setCodeLocal] = useState(starterCode || "");
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState("vs-dark");
  const [isFullscreen, setIsFullscreen] = useState(false);
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

  // Fullscreen styles
  const fullscreenStyle = isFullscreen
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        background: "#222",
      }
    : { flex: 1, height: "90vh" };

  return (
    <div style={fullscreenStyle}>
      {/* Modern Settings Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 12px",
          background: "#18181b",
          color: "#e5e7eb",
          borderBottom: "1px solid #23232a",
          zIndex: 10000,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          overflow: "hidden",
          minHeight: 40,
        }}
      >
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontWeight: 500, fontSize: 13 }}>Font</span>
            <select
              value={fontSize}
              onChange={e => setFontSize(Number(e.target.value))}
              style={{
                background: "#23232a",
                color: "#e5e7eb",
                border: "none",
                borderRadius: 3,
                padding: "2px 6px",
                fontSize: 13,
                outline: "none",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                minWidth: 55,
              }}
            >
              {[14, 16, 18, 20, 22, 24].map(size => (
                <option key={size} value={size}>{size}px</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontWeight: 500, fontSize: 13 }}>Theme</span>
            <select
              value={theme}
              onChange={e => setTheme(e.target.value)}
              style={{
                background: "#23232a",
                color: "#e5e7eb",
                border: "none",
                borderRadius: 3,
                padding: "2px 6px",
                fontSize: 13,
                outline: "none",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                minWidth: 55,
              }}
            >
              <option value="vs-dark">Dark</option>
              <option value="vs-light">Light</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => setIsFullscreen(f => !f)}
          style={{
            background: isFullscreen ? "#23232a" : "#23232a",
            color: "#e5e7eb",
            border: "1px solid #6366f1",
            borderRadius: 6,
            padding: "6px 14px 6px 8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isFullscreen ? "0 0 0 2px #6366f1" : "none",
            transition: "box-shadow 0.2s",
            fontSize: 13,
            fontWeight: 500,
            gap: 6,
            maxWidth: 160,
            marginRight : 70,
            overflow: "hidden",
          }}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {/* Fullscreen SVG icon, always visible with correct color and margin */}
          {isFullscreen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'block'}}><polyline points="9 17 15 17 15 11"/><polyline points="15 7 15 3 9 3"/><polyline points="9 7 9 11 15 11"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{display:'block'}}><polyline points="4 4 10 4 10 10"/><polyline points="20 4 14 4 14 10"/><polyline points="4 20 10 20 10 14"/><polyline points="20 20 14 20 14 14"/></svg>
          )}
          <span style={{marginLeft:6, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
        </button>
      </div>
      <Editor
        height={isFullscreen ? "calc(100vh - 48px)" : "90vh"}
        defaultLanguage="javascript"
        defaultValue={starterCode}
        value={code}
        onChange={handleEditorChange}
        theme={theme}
        options={{
          fontSize,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}