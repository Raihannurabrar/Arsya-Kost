function togglePass() {
  const pass = document.getElementById("password");
  pass.type = pass.type === "password" ? "text" : "password";
}

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const error = document.getElementById("error");

  if (username === "11713291723" && password === "13291723") {
    alert("Berhasil Login!");
    window.location.href = "index.html"; // Pindah ke index.html
  } else {
    error.textContent = "Username atau password salah!";
    error.style.color = "red";
  }
}
