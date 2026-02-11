document.addEventListener("DOMContentLoaded", () => {
  // HERO animation
  const quote = document.querySelector(".hero-quote");
  const btn = document.querySelector(".hero-btn");
  const lines = quote.innerHTML.split('<br>');
  quote.innerHTML = '';

  lines.forEach((lineText, i) => {
    const line = document.createElement('div');
    line.textContent = lineText;
    line.style.opacity = '0';
    line.style.transform = 'translateY(20px)';
    line.style.transition = 'all 0.8s ease';
    quote.appendChild(line);

    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    }, 400 * (i + 1));
  });

  setTimeout(() => {
    btn.style.opacity = '1';
    btn.style.transform = 'translateY(0)';
  }, 400 * (lines.length + 1));
});

// FAQ toggle with smoother animation
document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => {
    const answer = btn.nextElementSibling;
    if (!answer.style.maxHeight || answer.style.maxHeight === '0px') {
      answer.style.display = 'block';
      answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
      answer.style.maxHeight = '0px';
      setTimeout(() => answer.style.display = 'none', 300);
    }
  });
});

// NEW ARRIVALS horizontal drag/swipe
const slider = document.querySelector('.arrival-scroll');
let isDown = false, startX, scrollLeft, velocity = 0;
let momentumID, pauseAutoScroll = false;

// Use requestAnimationFrame for drag updates
function updateSlider(x) {
  const walk = (x - startX) * 2;
  slider.scrollLeft = scrollLeft - walk;
}

function endDrag() {
  isDown = false;
  pauseAutoScroll = false;
  startMomentum(velocity);
}

function startMomentum(v) {
  function momentum() {
    slider.scrollLeft -= v;
    v *= 0.92; // smoother friction
    if (Math.abs(v) > 0.5) momentumID = requestAnimationFrame(momentum);
  }
  momentumID = requestAnimationFrame(momentum);
}

function cancelMomentum() {
  if(momentumID) cancelAnimationFrame(momentumID);
}

// Desktop drag
slider.addEventListener('mousedown', e => {
  isDown = true; pauseAutoScroll = true;
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
  lastX = e.pageX;
  cancelMomentum();
});
slider.addEventListener('mousemove', e => {
  if(!isDown) return;
  updateSlider(e.pageX);
  velocity = e.pageX - lastX; lastX = e.pageX;
});
slider.addEventListener('mouseup', endDrag);
slider.addEventListener('mouseleave', endDrag);

// Mobile drag
slider.addEventListener('touchstart', e => {
  isDown = true; pauseAutoScroll = true;
  startX = e.touches[0].pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
  lastX = e.touches[0].pageX;
  cancelMomentum();
});
slider.addEventListener('touchmove', e => {
  if(!isDown) return;
  updateSlider(e.touches[0].pageX);
  velocity = e.touches[0].pageX - lastX; lastX = e.touches[0].pageX;
});
slider.addEventListener('touchend', endDrag);

// Smooth auto-slide
function animateSlide() {
  if (!pauseAutoScroll && !isDown) {
    slider.scrollLeft += 0.3;
    if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth) {
      slider.scrollLeft = 0;
    }
  }
  requestAnimationFrame(animateSlide);
}
requestAnimationFrame(animateSlide);

// HAMBURGER MENU
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".header nav ul");

hamburger.addEventListener("click", e => {
  e.stopPropagation();
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});
navMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  });
});
document.addEventListener("click", e => {
  if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  }
});
