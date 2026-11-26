function getKeywords(code) {
    return new Set(code.match(/[A-Za-z_$][\w$]*/g) || []);
}

function createSuggestionPanel() {
    let panel = document.getElementById("leetcode-keyword-suggestions");
    if (panel) return panel;

    panel = document.createElement("div");
    panel.id = "leetcode-keyword-suggestions";
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-label", "Code keyword suggestions");
    Object.assign(panel.style, {
        position: "fixed",
        top: "12px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: "2147483647",
        maxWidth: "90vw",
        maxHeight: "150px",
        overflowY: "auto",
        padding: "10px 14px",
        border: "1px solid #4b5563",
        borderRadius: "8px",
        background: "#111827",
        color: "#f9fafb",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
        font: "13px/1.4 sans-serif"
    });

    document.body.prepend(panel);
    return panel;
}

function acceptSuggestion(editor, monaco, suggestion, state) {
    const model = editor.getModel();
    const position = editor.getPosition();
    if (!model || !position || !suggestion) return;

    const word = model.getWordUntilPosition(position);
    const range = new monaco.Range(
        position.lineNumber,
        word.startColumn,
        position.lineNumber,
        word.endColumn
    );
    editor.executeEdits("keyword-suggestions", [{ range, text: suggestion }]);
    editor.setPosition({
        lineNumber: position.lineNumber,
        column: word.startColumn + suggestion.length
    });
    editor.focus();
    renderSuggestions(editor, monaco, state);
}

function renderSuggestions(editor, monaco, state) {
    const model = editor.getModel();
    const position = editor.getPosition();
    if (!model || !position) return;

    const panel = createSuggestionPanel();
    if (state.dismissed) {
        state.active = null;
        panel.style.display = "none";
        return;
    }

    const prefix = model.getWordUntilPosition(position).word.toLowerCase();
    const keyword = [...getKeywords(model.getValue())]
        .filter(word => {
            const normalized = word.toLowerCase();
            return prefix && normalized !== prefix && normalized.startsWith(prefix);
        })
        .sort((a, b) => a.length - b.length || a.localeCompare(b))[0];

    panel.replaceChildren();
    panel.style.display = keyword ? "block" : "none";
    state.active = keyword || null;
    if (!keyword) return;

    const title = document.createElement("strong");
    title.textContent = "Code suggestions";
    title.style.marginRight = "10px";
    panel.appendChild(title);

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = keyword;
    button.title = `Press Tab or click to insert ${keyword}`;
    Object.assign(button.style, {
        margin: "3px",
        padding: "4px 8px",
        border: "1px solid #6b7280",
        borderRadius: "5px",
        background: "#374151",
        color: "inherit",
        cursor: "pointer",
        font: "inherit"
    });
    button.addEventListener("click", () =>
        acceptSuggestion(editor, monaco, state.active, state)
    );
    panel.appendChild(button);
}

let keywordSuggestionTimer;

function registerKeywordSuggestions() {
    const monaco = window.monaco;
    const editor = monaco?.editor?.getEditors?.()[0];
    const model = editor?.getModel?.();

    if (!monaco || !model) {
        return false;
    }

    const state = { active: null, dismissed: false };
    const updateSuggestions = () => renderSuggestions(editor, monaco, state);

    updateSuggestions();
    model.onDidChangeContent(() => {
        state.dismissed = false;
        updateSuggestions();
    });
    editor.onDidChangeCursorPosition(updateSuggestions);
    editor.onKeyDown(event => {
        if (event.keyCode === monaco.KeyCode.Tab && !event.shiftKey && state.active) {
            event.preventDefault();
            event.stopPropagation();
            acceptSuggestion(editor, monaco, state.active, state);
        } else if (event.keyCode === monaco.KeyCode.Escape && state.active) {
            event.preventDefault();
            event.stopPropagation();
            state.dismissed = true;
            updateSuggestions();
        }
    });

    window.clearInterval(keywordSuggestionTimer);

    const code = model.getValue();
    window.postMessage({ type: "LEETCODE_CODE", code });
    return true;
}

keywordSuggestionTimer = window.setInterval(registerKeywordSuggestions, 500);
registerKeywordSuggestions();
