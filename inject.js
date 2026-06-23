console.log("page context");

setTimeout(() => {

const editor = window.monaco?.editor?.getEditors?.()[0];

if (editor) {
    const code = editor.getValue();

    window.postMessage({
        type: "LEETCODE_CODE",
        code
    });
}
else {
    window.postMessage({
        type: "LEETCODE_CODE",
        code: "error: editor not found"
    });
}
}, 10000);
