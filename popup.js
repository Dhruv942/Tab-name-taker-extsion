let currentTitle = '';

document.addEventListener('DOMContentLoaded', () => {
  getAndSaveCurrentTabTitle();
  document.getElementById('copyBtn').addEventListener('click', () => {
    if (currentTitle) {
      navigator.clipboard.writeText(currentTitle).then(() => {
        alert("Title copied to clipboard!");
      });
    }
  });
  document.getElementById('printBtn').addEventListener('click', () => {
    if (currentTitle) {
      printTabTitle(currentTitle);
    }
  });
  document.getElementById('showTitleBtn').addEventListener('click', () => {
    if (currentTitle) {
      showTitleDetails(currentTitle);
    }
  });
  document.getElementById('searchInput').addEventListener('input', loadHistory);
});

function getAndSaveCurrentTabTitle() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const title = tabs[0].title;
    currentTitle = title;
    document.getElementById('titleText').textContent = title;

    chrome.storage.local.get({ titles: [] }, (data) => {
      const updated = [title, ...data.titles.filter(t => t !== title)].slice(0, 20);
      chrome.storage.local.set({ titles: updated }, loadHistory);
    });
  });
}

function showTitleDetails(title) {
  const detailsWindow = window.open('', '_blank');
  detailsWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Title Details</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          padding: 30px; 
          background: #f5f5f5;
          margin: 0;
        }
        .container {
          background: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          max-width: 600px;
          margin: 0 auto;
        }
        .title { 
          font-size: 24px; 
          font-weight: bold; 
          margin-bottom: 20px;
          color: #333;
          word-wrap: break-word;
        }
        .info {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-top: 20px;
        }
        .label {
          font-weight: bold;
          color: #666;
          margin-bottom: 5px;
        }
        .value {
          color: #333;
          margin-bottom: 15px;
        }
        .timestamp { 
          color: #666; 
          font-size: 14px;
          margin-top: 20px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="title">${title}</div>
        <div class="info">
          <div class="label">Title Length:</div>
          <div class="value">${title.length} characters</div>
          
          <div class="label">Words Count:</div>
          <div class="value">${title.split(' ').length} words</div>
          
          <div class="label">First 50 Characters:</div>
          <div class="value">${title.substring(0, 50)}${title.length > 50 ? '...' : ''}</div>
        </div>
        <div class="timestamp">Viewed on: ${new Date().toLocaleString()}</div>
      </div>
    </body>
    </html>
  `);
  detailsWindow.document.close();
}

function printTabTitle(title) {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Print Tab Title</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
        .timestamp { color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="title">${title}</div>
      <div class="timestamp">Printed on: ${new Date().toLocaleString()}</div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

function loadHistory() {
  const filter = document.getElementById('searchInput').value.toLowerCase();
  chrome.storage.local.get({ titles: [] }, (data) => {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    data.titles
      .filter(t => t.toLowerCase().includes(filter))
      .forEach(title => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${title}</span>`;
        historyList.appendChild(li);
      });
  });
}
