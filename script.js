document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const referenceInput = document.getElementById("reference-input");
  const searchBtn = document.getElementById("search-btn");
  const randomBtn = document.getElementById("random-btn");

  const verseCard = document.getElementById("verse-card");
  const verseText = document.getElementById("verse-text");
  const verseRef = document.getElementById("verse-ref");
  const verseVersion = document.getElementById("verse-version");

  const animateBtn = document.getElementById("animate-btn");
  const ball = document.getElementById("animation-ball");
  const wrapper = document.getElementById("animation-wrapper");

  // Popmotion
  const pop = window.popmotion;
  const tween = pop && pop.tween;
  const easing = pop && pop.easing;

  console.log("window.popmotion is:", pop);

  // Helper: animate the verse card (fade + slide)
  function animateVerseCard() {
    if (!tween || !easing) {
      console.warn("Popmotion did not load.");
      return;
    }

    // Start slightly lower and transparent, then move up & fade in
    tween({
      from: { y: 20, opacity: 0.0 },
      to: { y: 0, opacity: 1.0 },
      duration: 600,
      ease: easing.easeOut
    }).start(v => {
      verseCard.style.transform = `translateY(${v.y}px)`;
      verseCard.style.opacity = v.opacity;
    });
  }

  // Extra: animate ball (simple pulse) when manually triggered
  function animateBall() {
    if (!tween) return;

    tween({
      from: 1,
      to: 1.2,
      duration: 200,
      ease: easing.easeInOut
    }).start(scale => {
      ball.style.transform = `scale(${scale})`;
    });

    setTimeout(() => {
      tween({
        from: 1.2,
        to: 1,
        duration: 200,
        ease: easing.easeOut
      }).start(scale => {
        ball.style.transform = `scale(${scale})`;
      });
    }, 200);
  }

  // Fetch a verse by reference
  function fetchVerse(reference) {
    if (!reference) {
      verseText.textContent = "";
      verseRef.textContent = "";
      verseVersion.textContent = "";
      verseCard.querySelector("p.text-secondary").textContent =
        "Please type a reference like 'John 3:16'.";
      return;
    }

    verseCard.querySelector("p.text-secondary").textContent = "Loading verse...";

    const url = `https://bible-api.com/${encodeURIComponent(reference)}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          verseText.textContent = "";
          verseRef.textContent = "";
          verseVersion.textContent = "";
          verseCard.querySelector("p.text-secondary").textContent =
            "Could not find that reference. Try another.";
          return;
        }

        verseCard.querySelector("p.text-secondary").textContent = "";
        verseText.textContent = data.text.trim();
        verseRef.textContent = data.reference || "";
        verseVersion.textContent = data.translation_name
          ? `Version: ${data.translation_name}`
          : "";

        animateVerseCard();
      })
      .catch(err => {
        console.error(err);
        verseCard.querySelector("p.text-secondary").textContent =
          "Something went wrong. Please try again.";
      });
  }

  // Fetch a random verse (using Bible API random endpoint)
  function fetchRandomVerse() {
    verseCard.querySelector("p.text-secondary").textContent = "Loading random verse...";

    fetch("https://bible-api.com/?random=verse")
      .then(response => response.json())
      .then(data => {
        verseCard.querySelector("p.text-secondary").textContent = "";
        verseText.textContent = data.text.trim();
        verseRef.textContent = data.reference || "";
        verseVersion.textContent = data.translation_name
          ? `Version: ${data.translation_name}`
          : "";

        animateVerseCard();
      })
      .catch(err => {
        console.error(err);
        verseCard.querySelector("p.text-secondary").textContent =
          "Something went wrong. Please try again.";
      });
  }

  // Event listeners
  if (searchBtn && referenceInput) {
    searchBtn.addEventListener("click", () => {
      fetchVerse(referenceInput.value.trim());
    });

    referenceInput.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        fetchVerse(referenceInput.value.trim());
      }
    });
  }

  if (randomBtn) {
    randomBtn.addEventListener("click", fetchRandomVerse);
  }

  if (animateBtn) {
    animateBtn.addEventListener("click", () => {
      animateVerseCard();
      animateBall();
    });
  }

  if (ball) {
    ball.addEventListener("click", animateBall);
  }
});