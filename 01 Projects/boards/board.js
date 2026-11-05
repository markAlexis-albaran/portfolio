// Fills every .status bar with the time and the signal, wifi and battery icons
document.querySelectorAll(".status").forEach(function (s) {
  s.innerHTML =
    '<span>12:48</span>' +
    '<span class="status__icons">' +
    '<svg width="20" height="13" viewBox="0 0 20 13"><rect x="0" y="9" width="3.4" height="4" rx="1" fill="currentColor"/><rect x="5.4" y="6" width="3.4" height="7" rx="1" fill="currentColor"/><rect x="10.8" y="3" width="3.4" height="10" rx="1" fill="currentColor"/><rect x="16.2" y="0" width="3.4" height="13" rx="1" fill="currentColor"/></svg>' +
    '<svg width="18" height="13" viewBox="0 0 18 13"><path d="M9 12.5l2.4-2.9a3.6 3.6 0 0 0-4.8 0z M3.6 6.6a7.6 7.6 0 0 1 10.8 0l-1.6 1.9a5.2 5.2 0 0 0-7.6 0z M0.4 3.4a12 12 0 0 1 17.2 0l-1.6 1.9a9.6 9.6 0 0 0-14 0z" fill="currentColor"/></svg>' +
    '<svg width="28" height="13" viewBox="0 0 28 13"><rect x="0.5" y="0.5" width="24" height="12" rx="3.5" fill="none" stroke="currentColor" opacity="0.4"/><rect x="2.5" y="2.5" width="20" height="8" rx="2" fill="currentColor"/><rect x="26" y="4.5" width="1.6" height="4" rx="0.8" fill="currentColor" opacity="0.4"/></svg>' +
    '</span>';
});
