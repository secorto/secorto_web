document.querySelector('.hamburger').addEventListener('click', () => {
  document.querySelector('.sidebar-toggle').classList.toggle('sidebar-open');
  document.querySelector('.hamburger').classList.toggle('sidebar-open');
  localStorage.setItem("sidebarOpen", JSON.stringify(document.querySelector('.sidebar-toggle').classList.contains('sidebar-open')))
});

