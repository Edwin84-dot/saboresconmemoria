() => {

  // ========================================================
  // 1. NAVEGACIÓN SUAVE ENTRE PANTALLAS (HASH SMOOTH SCROLL)
  // ========================================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // ========================================================
  // 2. OBSERVADOR PARA DETECTAR LA PANTALLA ACTIVA (01 / 16)
  // ========================================================
  const screens = document.querySelectorAll('.screen');
  const indicator = document.getElementById('screenIndicator');
  const navLinks = document.querySelectorAll('.nav-shortcuts .nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.55 // Se activa cuando más de la mitad de la pantalla es visible
  };

  const screenObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const screenNumber = entry.target.getAttribute('data-screen');
        if (screenNumber && indicator) {
          indicator.textContent = `Pantalla ${screenNumber} / 16`;
        }

        // Resaltar atajo superior
        const currentId = `#${entry.target.id}`;
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === currentId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  screens.forEach((screen) => screenObserver.observe(screen));

  // ========================================================
  // 3. DESPIECE INTERACTIVO DEL MORTIÑO (PANTALLA 04)
  // ========================================================
  const ingredientsData = {
    mortino: {
      name: "El Mortiño Andino",
      latin: "Vaccinium floribundum",
      meaning: "Fruto silvestre de las alturas del páramo. Su tinte denso encarna la sangre cósmica y abre el umbral hacia el <strong>Uku Pacha</strong>.",
      color: "#581845 (Luto Sagrado)",
      property: "Antioxidante / Tintura Ritual"
    },
    ishpingo: {
      name: "Flor de Ishpingo",
      latin: "Ocotea quixos",
      meaning: "La canela americana ceremonial de la Amazonía. Su corteza en forma de cáliz aporta calor reconfortante y mística al brebaje.",
      color: "#E2A346 (Aroma Solar)",
      property: "Esencia Sagrada / Calor de Hogar"
    },
    hierbas: {
      name: "Hierbas de Monte",
      latin: "Arrayán, Ataco y Sangorache",
      meaning: "Ramillete de infusión medicinal. El sangorache aporta el color carmesí vivo (#C70039) y el arrayán purifica el espíritu frente al dolor del duelo.",
      color: "#C70039 (Fuerza Vital)",
      property: "Purificación Espiritual"
    }
  };

  const hotspots = document.querySelectorAll('.hotspot');
  const cardName = document.getElementById('cardName');
  const cardLatin = document.getElementById('cardLatin');
  const cardMeaning = document.getElementById('cardMeaning');
  const cardColor = document.getElementById('cardColor');
  const cardProp = document.getElementById('cardProp');

  hotspots.forEach((button) => {
    button.addEventListener('click', (e) => {
      hotspots.forEach((b) => b.classList.remove('active'));
      e.target.classList.add('active');

      const key = e.target.getAttribute('data-ingredient');
      const data = ingredientsData[key];

      if (data && cardName) {
        cardName.textContent = data.name;
        cardLatin.textContent = data.latin;
        cardMeaning.innerHTML = data.meaning;
        cardColor.textContent = data.color;
        cardProp.textContent = data.property;
      }
    });
  });

}

// ========================================================
// 4. CONTROLADOR DE AUDIO PARA RELATOS ORALES (P06, P10, P14)
// ========================================================
const audioStates = {};

function toggleAudioOral(buttonId, statusId) {
  const btn = document.getElementById(buttonId);
  const status = document.getElementById(statusId);

  if (!audioStates[buttonId]) {
    audioStates[buttonId] = true;
    btn.innerHTML = '<span class="icon">❚❚</span> En pausa (Click para detener)';
    btn.style.backgroundColor = 'var(--gold)';
    btn.style.color = 'var(--bg-dark)';
    if (status) status.textContent = 'Reproduciendo atmósfera sonora andina...';
  } else {
    audioStates[buttonId] = false;
    btn.innerHTML = '<span class="icon">▶</span> Escuchar Relato Oral';
    btn.style.backgroundColor = 'transparent';
    btn.style.color = 'var(--gold)';
    if (status) status.textContent = 'Narración en pausa';
  }
}
// ========================================================
// CONTROLADOR DE AUDIO REAL PARA RELATOS ORALES
// ========================================================
function toggleAudioOral(audioId, buttonId, statusId) {
  const audioElement = document.getElementById(audioId);
  const btn = document.getElementById(buttonId);
  const status = document.getElementById(statusId);

  // Si el audio seleccionado ya se está reproduciendo: lo pausamos
  if (!audioElement.paused) {
    audioElement.pause();
    btn.innerHTML = '<span class="icon">▶</span> Reanudar Relato Oral';
    btn.style.backgroundColor = 'transparent';
    btn.style.color = 'var(--gold)';
    if (status) status.textContent = 'Narración en pausa';
    return;
  }

  // Detener cualquier otro audio que esté sonando en otras pantallas
  document.querySelectorAll('audio').forEach((a) => {
    if (a !== audioElement) {
      a.pause();
      a.currentTime = 0; // Reinicia el audio anterior
    }
  });

  // Restaurar el diseño visual de todos los botones de audio
  document.querySelectorAll('.audio-btn').forEach((b) => {
    b.innerHTML = '<span class="icon">▶</span> Escuchar Relato Oral';
    b.style.backgroundColor = 'transparent';
    b.style.color = 'var(--gold)';
  });

  // Reproducir el audio actual
  audioElement.play().then(() => {
    btn.innerHTML = '<span class="icon">❚❚</span> Pausar Relato Oral';
    btn.style.backgroundColor = 'var(--gold)';
    btn.style.color = 'var(--bg-dark)';
    if (status) status.textContent = 'Reproduciendo atmósfera sonora andina...';
  }).catch((error) => {
    console.error('Error al reproducir audio:', error);
    if (status) status.textContent = 'Verifica que el archivo exista en la carpeta audio/';
  });

  // Evento cuando el audio termine por completo
  audioElement.onended = () => {
    btn.innerHTML = '<span class="icon">▶</span> Escuchar de nuevo';
    btn.style.backgroundColor = 'transparent';
    btn.style.color = 'var(--gold)';
    if (status) status.textContent = 'Relato finalizado';
  };
}