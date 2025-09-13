// Version checking utility to detect app updates
export const APP_VERSION = '1.0.0'; // Update this when you deploy changes

export function checkForUpdates(): Promise<boolean> {
    return new Promise((resolve) => {
        // Check if there's a new version available
        const currentVersion = localStorage.getItem('app-version');

        if (currentVersion !== APP_VERSION) {
            // Version has changed, update stored version
            localStorage.setItem('app-version', APP_VERSION);
            resolve(true);
        } else {
            resolve(false);
        }
    });
}

export function showUpdateNotification() {
    // Create a notification banner
    const notification = document.createElement('div');
    notification.id = 'update-notification';
    notification.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 20px;
      text-align: center;
      z-index: 9999;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="max-width: 600px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 15px;">
        <span style="font-size: 18px;">🔄</span>
        <span style="flex: 1; font-weight: 500;">
          App updated! Please refresh to get the latest version.
        </span>
        <button 
          onclick="window.location.reload()" 
          style="
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: background 0.2s;
          "
          onmouseover="this.style.background='rgba(255,255,255,0.3)'"
          onmouseout="this.style.background='rgba(255,255,255,0.2)'"
        >
          Refresh Now
        </button>
        <button 
          onclick="this.parentElement.parentElement.parentElement.remove()" 
          style="
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 20px;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          ×
        </button>
      </div>
    </div>
  `;

    document.body.appendChild(notification);

    // Auto-hide after 30 seconds
    setTimeout(() => {
        const existing = document.getElementById('update-notification');
        if (existing) {
            existing.remove();
        }
    }, 30000);
}

export function initializeVersionCheck() {
    checkForUpdates().then((hasUpdate) => {
        if (hasUpdate) {
            showUpdateNotification();
        }
    });
}
