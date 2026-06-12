import { browser } from "$app/environment";

let mathjaxLoaded = false;
let mathjaxRequires = 0;
let mathjaxScript: HTMLScriptElement | undefined;

export function loadMathJax() {
    mathjaxRequires++;
    if (mathjaxRequires > 0) {
        doLoad();
    }
}

export function mathJaxTypeset() {
    if (mathjaxRequires > 0) {
        doTypeset();
    }
}

export function unloadMathJax() {
    mathjaxRequires--;
    if (mathjaxRequires <= 0) {
        doUnload();
        mathjaxRequires = 0;
    }
}

function doTypeset() {
    const MathJax: any = (globalThis as any[any])["MathJax"];
    if (browser && mathjaxLoaded && mathjaxScript && MathJax && MathJax["typeset"]) {
        MathJax.typeset();
    }
}

function doLoad() {
    if (browser && !mathjaxLoaded) {
        console.log("Installing MathJax");
        mathjaxScript = document.createElement("script");
        mathjaxScript.src = "https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-chtml.js";
        mathjaxScript.async = true;
        mathjaxScript.onload = () => {
            console.log("MathJax loaded!");
        };
        (window as any[any])["MathJax"] = {
            tex: {
                inlineMath: {'[+]': [['$', '$']]}
            },
            output: {
                displayOverflow: "linebreak"
            }
        };
        document.body.append(mathjaxScript);
        mathjaxLoaded = true;
    }
}

function doUnload() {
    if (browser && mathjaxLoaded && mathjaxScript) {
        console.log("Uninstalling MathJax");
        document.body.removeChild(mathjaxScript);

        // clear mathjax context
        (window as any[any])["MathJax"] = undefined;
        mathjaxLoaded = false;
    }
}

