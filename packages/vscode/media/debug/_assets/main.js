(function () {
    const webframe = document.getElementById("webframe");
    const vscode = acquireVsCodeApi();
  
    // 传递event
    window.addEventListener("message", (event) => {
      if (event.data && event.data.source === 'web') {
        vscode.postMessage(event.data, '*');
      } else {
        webframe.contentWindow.postMessage(event.data, "*");
      }
    });
  })();