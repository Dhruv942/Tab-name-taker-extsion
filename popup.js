let currentTitle = '';

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabTitle();
  document.getElementById('getTitleBtn').addEventListener('click', () => {
    if (currentTitle) {
      showTitle(currentTitle);
    }
  });
  document.getElementById('searchInput').addEventListener('input', loadHistory);
});

function getCurrentTabTitle() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const title = tabs[0].title;
    currentTitle = title;

    chrome.storage.local.get({ titles: [] }, (data) => {
      const updated = [title, ...data.titles.filter(t => t !== title)].slice(0, 20);
      chrome.storage.local.set({ titles: updated }, loadHistory);
    });
  });
}

function showTitle(title) {
  const titleDisplay = document.getElementById('titleDisplay');
  const currentTitleElement = document.getElementById('currentTitle');
  const timestampElement = document.querySelector('.timestamp');
  
  currentTitleElement.textContent = title;
  timestampElement.textContent = `Retrieved on: ${new Date().toLocaleString()}`;
  
  titleDisplay.style.display = 'block';
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
