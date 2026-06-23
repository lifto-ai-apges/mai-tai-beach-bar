document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Scroll Effect
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // 2. Mobile Navigation Toggle
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-item a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 3. Contact Modal Logic
  const contactModal = document.getElementById('contact-modal');
  const openContactBtns = document.querySelectorAll('.open-contact-modal, .open-booking-modal');
  const closeContactBtn = document.getElementById('close-contact-modal');

  function openContactModal() {
    if (contactModal) {
      contactModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
  }

  function closeContactModal() {
    if (contactModal) {
      contactModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openContactBtns.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      openContactModal();
    });
  });

  if (closeContactBtn) closeContactBtn.addEventListener('click', closeContactModal);

  // Close modal when clicking outside content
  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) {
        closeContactModal();
      }
    });
  }

  // 4. FAQ Accordions (Smooth Height Transition)
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items first (optional accordion behavior)
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = '0';
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = '0';
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // 5. Dynamic Open/Closed status based on Philippine Time (GMT+8)
  const openStatusEl = document.getElementById('open-status');
  if (openStatusEl) {
    // Determine the branch name based on the current page file name
    let branchName = 'Boracay';
    if (window.location.pathname.includes('port-barton')) {
      branchName = 'Port Barton';
    } else if (window.location.pathname.includes('siquijor')) {
      branchName = 'Siquijor';
    }

    updateBranchStatus(branchName);
    // Refresh status every 30 seconds
    setInterval(() => updateBranchStatus(branchName), 30000);
  }

  function updateBranchStatus(branch) {
    const statusEl = document.getElementById('open-status');
    if (!statusEl) return;

    // Get current date/time in Philippine Time (GMT+8)
    const options = { timeZone: 'Asia/Manila', hour: 'numeric', minute: 'numeric', hour12: false };
    const formatter = new Intl.DateTimeFormat([], {
      timeZone: 'Asia/Manila',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });
    
    const nowPH = new Date();
    const parts = formatter.formatToParts(nowPH);
    let hourPH = parseInt(parts.find(p => p.type === 'hour').value);
    let minutePH = parseInt(parts.find(p => p.type === 'minute').value);
    
    // Convert current time to total minutes in the day
    const currentTimeInMinutes = hourPH * 60 + minutePH;

    // Define operating hours in minutes
    // Open is 11:00 AM (11 * 60 = 660 minutes) for all branches
    const openTime = 11 * 60; 
    let closeTime = 0; 
    let closeString = '';

    if (branch === 'Boracay') {
      closeTime = 24 * 60; // 12:00 AM midnight
      closeString = '12:00 AM';
    } else if (branch === 'Port Barton') {
      closeTime = 23 * 60; // 11:00 PM
      closeString = '11:00 PM';
    } else if (branch === 'Siquijor') {
      closeTime = 23 * 60 + 30; // 11:30 PM
      closeString = '11:30 PM';
    }

    const isOpen = currentTimeInMinutes >= openTime && currentTimeInMinutes < closeTime;

    if (isOpen) {
      statusEl.innerHTML = `<span style="color: #22c55e; font-weight: 600;">Open Now</span> • Closes at ${closeString}`;
    } else {
      statusEl.innerHTML = `<span style="color: #ef4444; font-weight: 600;">Closed</span> • Opens at 11:00 AM`;
    }
  }

  // 6. Menu Location Switching and Category Tabs
  const locButtons = document.querySelectorAll('.menu-loc-btn');
  const tabButtons = document.querySelectorAll('.menu-tab-btn');
  const locWrappers = document.querySelectorAll('.menu-location-wrapper');
  
  if (locButtons.length > 0 || tabButtons.length > 0) {
    locButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetLoc = btn.getAttribute('data-location');
        locButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        locWrappers.forEach(wrap => {
          if (wrap.getAttribute('data-location') === targetLoc) {
            wrap.classList.add('is-active');
          } else {
            wrap.classList.remove('is-active');
          }
        });
      });
    });

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetCat = btn.getAttribute('data-category');
        tabButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        document.querySelectorAll('.menu-tab-content').forEach(panel => {
          if (panel.getAttribute('data-category') === targetCat) {
            panel.classList.add('is-active');
          } else {
            panel.classList.remove('is-active');
          }
        });
      });
    });
  }
});
