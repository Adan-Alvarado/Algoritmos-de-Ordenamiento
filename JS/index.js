document.addEventListener('DOMContentLoaded', () => {
  const temaGuardado = sessionStorage.getItem('tema') || 'claro';
  if (temaGuardado === 'oscuro') {
    document.body.classList.add('dark');
    document.getElementById('btn-tema').textContent = '☀️ Cambiar a Claro';
  }
});

document.getElementById('btn-tema').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const tema = document.body.classList.contains('dark') ? 'oscuro' : 'claro';
  sessionStorage.setItem('tema', tema);
  document.getElementById('btn-tema').textContent = document.body.classList.contains('dark') 
    ? '☀️ Cambiar a Claro' 
    : '🌙 Cambiar a Oscuro';
});