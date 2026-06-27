const script = document.createElement("script");
script.src = chrome.runtime.getURL("inject.js");
const special_characters_string = "!@#$%^&*()+-=[]{}|;':\",./<>?";
let special_characters = new Set();

for (let i = 0; i < special_characters_string.length; i++) {
    special_characters.add(special_characters_string[i]);
}

let keywords = new Set();

(document.head || document.documentElement)
    .appendChild(script);

function isNumeric(str) {
  return !isNaN(str) && !isNaN(parseFloat(str));
}

function remove_special_characters(word) {
    let ret = "";
    let found_word = false;

    for (let i = 0; i < word.length; i++) {
        if (special_characters.has(word[i]) && !found_word) {
            continue;
        }
        else if (special_characters.has(word[i]) && found_word) {
            break;
        }
        else {
            ret += word[i];
            found_word = true;
        }
    }
    return ret;
}

window.addEventListener("message", event => {
    if (event.data.type === "LEETCODE_CODE") {
        let words = event.data.code.split(/\s+/).filter(word => word.length > 0);

        for (let i = 0; i < words.length; i++) {
            let word = remove_special_characters(words[i]);
            if (word.length > 0 && !isNumeric(word)) {
                keywords.add(word);
            }
        }
        for (const word of keywords) {
            console.log("Keyword:", word);
        }
    }
});
