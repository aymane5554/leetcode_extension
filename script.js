const script = document.createElement("script");
script.src = chrome.runtime.getURL("inject.js");

(document.head || document.documentElement)
    .appendChild(script);

window.addEventListener("message", event => {
    if (event.data.type === "LEETCODE_CODE") {
        console.log(event.data.code);
    }
});
