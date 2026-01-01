(function(){
'use strict';


function qs(sel){ return document.querySelector(sel); }
function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }
function showFormMessage(id, text, type='info'){ const el = qs('#'+id); if (!el) return; el.textContent = text; el.classList.remove('error','success','info'); el.classList.add(type); }

// Menu safety
try {
    const menuBtn = qs('#menu-open-button');
    const closeBtn = qs('#menu-close-button');
    const navLinks = qsa('.nav-menu .nav-link');
    //if (menuBtn) menuBtn.addEventListener('click', (e) => { console.log('menuBtn clicked', e); document.body.classList.toggle('show-mobile-menu'); });
    if (closeBtn && menuBtn) closeBtn.addEventListener('click', () => menuBtn.click());
    if (navLinks.length && menuBtn) navLinks.forEach(l => l.addEventListener('click', () => menuBtn.click()));
} catch (e) { /* ignore */ }

// Local storage helpers
function getUsers(){ try { return JSON.parse(localStorage.getItem('cw_users') || '{}'); } catch(e){ return {}; } }
function saveUsers(users){ localStorage.setItem('cw_users', JSON.stringify(users)); }

// Signup handler
const signupForm = qs('#signup-form');
if (signupForm){
    signupForm.addEventListener('submit', function(e){
        e.preventDefault();
        showFormMessage('signup-message','', 'info');
        if (!signupForm.checkValidity()){ signupForm.reportValidity(); return; }

        const fullname = (qs('#signup-fullname') && qs('#signup-fullname').value.trim()) || '';
        const email = (qs('#signup-email') && qs('#signup-email').value.trim().toLowerCase()) || '';
        const password = qs('#signup-password') ? qs('#signup-password').value : '';
        const confirm = qs('#signup-confirm') ? qs('#signup-confirm').value : '';

        if (password !== confirm){
            const confirmEl = qs('#signup-confirm');
            if (confirmEl){ confirmEl.setCustomValidity('Passwords do not match'); confirmEl.reportValidity(); confirmEl.addEventListener('input', () => confirmEl.setCustomValidity(''), { once:true }); }
            return;
        }

        const users = getUsers();
        if (!email){ showFormMessage('signup-message','Please enter an email','error'); return; }
        if (users[email]){ showFormMessage('signup-message','An account with this email already exists','error'); return; }

        users[email] = { fullname: fullname || null, email, password, createdAt: Date.now() };
        saveUsers(users);
        showFormMessage('signup-message','Account created. Redirecting to login...','success');
        setTimeout(() => { window.location.href = 'login.html'; }, 900);
    });
}

// Login handler
const loginForm = qs('#login-form');
if (loginForm){
    loginForm.addEventListener('submit', function(e){
        e.preventDefault();
        showFormMessage('login-message','', 'info');
        if (!loginForm.checkValidity()){ loginForm.reportValidity(); return; }

        const email = (qs('#login-email') && qs('#login-email').value.trim().toLowerCase()) || '';
        const password = qs('#login-password') ? qs('#login-password').value : '';

        const users = getUsers();
        const user = users[email];
        if (!user){ showFormMessage('login-message','No user found with that email','error'); return; }
        if (user.password !== password){ showFormMessage('login-message','Incorrect password','error'); return; }

        // Set a simple current user flag
        localStorage.setItem('cw_current_user', JSON.stringify({ email: user.email, fullname: user.fullname, loggedAt: Date.now() }));
        showFormMessage('login-message','Signed in. Redirecting...','success');
        setTimeout(() => { window.location.href = 'index.html'; }, 700);
    });
}

})();




//For testimonials slider and mobile menu toggle (guarded to avoid errors on pages without the menu)
const _navLinks = document.querySelectorAll(".nav-menu .nav-link");
const _menuOpenButton = document.querySelector("#menu-open-button");
const _menuCloseButton = document.querySelector("#menu-close-button");
if (_menuOpenButton) {
    _menuOpenButton.addEventListener("click", (e) => {
        console.log('_menuOpenButton clicked', e);
        //Toggle mobile menu visibility
        document.body.classList.toggle("show-mobile-menu");
    });

    //close menu when the close button is clicked
    if (_menuCloseButton) _menuCloseButton.addEventListener("click", () => _menuOpenButton.click());

    //close menu when the nav link is clicked
    _navLinks.forEach(link => {
        link.addEventListener("click", () => _menuOpenButton.click());
    });
}    

// Intialize Swiper slider
const swiper = new Swiper('.slider-wrapper', {
  loop: true,
  grabCursor: true,
  spaceBetween: 25,

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  breakpoints: {
    0: {
      slidesPerView: 1
    },
     768: {
      slidesPerView: 2
    },
     1024: {
      slidesPerView: 3
    }
  }
});

