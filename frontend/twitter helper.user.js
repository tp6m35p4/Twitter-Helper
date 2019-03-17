// ==UserScript==
// @name         twitter helper
// @version      1.0.0
// @description  This can help you to now what the tweeter said and suggest you the related news.
// @author       Yu-Zhen, Chen
// @match        https://twitter.com/*
// @include      https://twitter.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle ( `
    div.ana-container {
box-shadow: 0 0 0 0.5rem skyblue;
border-radius: 12px;
margin: 2rem;
outline-offset: 0.5rem;
}

div.text {
  padding: 1rem;
}

.loader {
margin: 2rem;
  border: 8px solid #f3f3f3;
  border-radius: 50%;
  border-top: 8px solid skyblue;
  width: 60px;
  height: 60px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
div.ana-news{
  border:1px solid;
  padding: 0.5rem;
  margin: 0.5rem;
  vertical-align:top;


}
hr.ana-hr {
border-top: 0.5rem solid skyblue;
margin: 0px;
}
` );
    var insert = 0;
    var status = 0;
    function getTone(content, cb) {
        var reqJson = {};
        reqJson.text = content;
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", function() {
            console.log(this.responseText);
            cb(this.responseText);
        });
        oReq.open("POST", "https://B10430016-final-tone.mybluemix.net");
        //oReq.open("POST", "http://localhost:3000");
        oReq.setRequestHeader("Content-Type", "application/json");
        oReq.setRequestHeader("Access-Control-Allow-Origin", "*");
        oReq.send(JSON.stringify(reqJson));
    }

    function afterClick(){
        console.log("do");
        var overlay = document.getElementById('permalink-overlay');
        setTimeout(function() {
            var x = overlay.getElementsByClassName('permalink-inner permalink-tweet-container');
            var t = x[0].getElementsByClassName('js-tweet-text-container');
            var loader = createHTMLElement("div", "loader");
            t[0].appendChild(loader);
            var p = t[0].getElementsByTagName('p');
            //console.log(p[0].textContent);
            getTone(p[0].textContent, function(data){
                t[0].removeChild(loader);
                var ana = createHTMLElement("div", "ana-container");
                var tone = createHTMLElement("div", "text");
                var keyWords = createHTMLElement("div", "text");
                var dataJson = JSON.parse(data);

                keyWords.innerHTML = "Related News:<br>"
                tone.innerHTML = `Tone of this tweet: ${dataJson.tone}`;
                dataJson.news.forEach(element => {
                    var keywordsDiv = createHTMLElement("div", "ana-news");
                    var keywordsA = createHTMLElement("a", "ana-news-a");
                    keywordsA.innerHTML = element.title;
                    keywordsA.setAttribute("href", element.url);
                    keywordsA.setAttribute("target", "_blank");
                    keywordsDiv.appendChild(keywordsA);
                    keyWords.appendChild(keywordsDiv);
                });

                ana.appendChild(tone);
                ana.appendChild(createHTMLElement("hr", "ana-hr"));
                ana.appendChild(keyWords);
                t[0].appendChild(ana);
                console.log("done");
            });
        },2000);
    }

    function createHTMLElement(element, className) {
        var temp = document.createElement(element);
        if(className) temp.setAttribute("class", className);
        return temp
    }

    function backToMain(){
        console.log("back");
    }

    document.getElementById("permalink-overlay").addEventListener("DOMNodeInserted", function(){
        if(status == 0){
            status = 1;
            afterClick();
        }
    });
    document.getElementById("permalink-overlay").addEventListener("DOMNodeRemoved", function(){
        if(status == 1 && this.getAttribute("style") == "display: none;"){
            status = 0;
            backToMain();
        }
    });
})();