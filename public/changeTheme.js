function changeTheme() {
  const body = document.body;
  const container = document.querySelector('.container');

  const isDark = body.classList.contains('dark-theme');

  if (isDark) {
    body.classList.replace('dark-theme', 'light-theme');
    container.classList.replace('dark-theme', 'light-theme');
  } else {
    body.classList.replace('light-theme', 'dark-theme');
    container.classList.replace('light-theme', 'dark-theme');
  }
}

window.changeTheme = changeTheme;