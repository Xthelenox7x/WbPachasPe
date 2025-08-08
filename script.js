document.addEventListener("DOMContentLoaded", () => {
  // ===== 1) Carrusel =====
  let slideIndex = 0;
  function showSlides() {
    const slides = document.querySelectorAll(".slide");
    if (slides.length === 0) return;
    slides.forEach(slide => slide.style.display = "none");
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].style.display = "block";
    setTimeout(showSlides, 3000);
  }
  showSlides();

  // ===== 2) Mostrar/ocultar formulario =====
  const btn = document.getElementById("mostrarFormulario");
  const formInscripcion = document.getElementById("formularioInscripcion");
  if (btn && formInscripcion) {
    btn.addEventListener("click", () => {
      formInscripcion.classList.toggle("visible");
    });
  }

  // ===== 3) Preview del nombre de archivo =====
  const fileInput = document.getElementById("archivo");
  const fileNameDisplay = document.getElementById("fileNameDisplay");
  if (fileInput && fileNameDisplay) {
    fileInput.addEventListener("change", () => {
      if (fileInput.files.length > 0) {
        const nombres = Array.from(fileInput.files)
          .map(f => f.name)
          .join(", ");
        fileNameDisplay.textContent =
          `Seleccionaste ${fileInput.files.length} archivo(s): ${nombres}`;
      } else {
        fileNameDisplay.textContent = "";
      }
    });
  }

  // ===== 4) Envío del formulario a Apps Script =====
  const form = document.querySelector("form"); // Asegúrate que tenga <form>
  if (form && fileInput) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const file = fileInput.files[0];
      if (!file) {
        alert("Selecciona un archivo PDF.");
        return;
      }
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        alert("El archivo debe ser PDF.");
        return;
      }

      const reader = new FileReader();
      reader.onload = function () {
        const base64Data = reader.result.split(',')[1];

        const data = new URLSearchParams();
        data.append("file", base64Data);
        data.append("fileName", file.name);
        data.append("mimeType", file.type);

        fetch("https://script.google.com/macros/s/AKfycbwsmWfIEqVwtMPeEXMXLVRtS10yyV8Qk66mwT50tTKkbh0KZnuq86dgd_U7KRSS27jM/exec", {
          method: "POST",
          body: data
        })
          .then(res => res.text())
          .then(text => {
            alert("✅ " + text);
            fileInput.value = "";
            if (fileNameDisplay) fileNameDisplay.textContent = "";
          })
          .catch(err => {
            alert("❌ Error al enviar: " + err);
          });
      };
      reader.readAsDataURL(file);
    });
  }
});
