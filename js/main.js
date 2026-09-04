/**
 * Sainath Khanawal — Main JavaScript
 * Lightweight, accessible interactions for multi-page navigation, menu search/filtering, FAQ accordions, and mobile drawer.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Current Year in Footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Sticky Header Elevation on Scroll & Back to Top
  const siteHeader = document.getElementById('siteHeader');
  const backToTopBtn = document.getElementById('backToTop');

  const handleScroll = () => {
    const scrollPos = window.scrollY || document.documentElement.scrollTop;

    if (siteHeader) {
      if (scrollPos > 30) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollPos > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 3. Mobile Navigation Drawer Controls
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openDrawer = () => {
    if (!mobileDrawer || !drawerOverlay) return;
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (!mobileDrawer || !drawerOverlay) return;
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openDrawer);
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // 4. Menu Category Filtering & Live Search (For menu.html and index.html)
  const filterButtons = document.querySelectorAll('.menu-tab-btn, .menu-filter-btn');
  const menuCards = document.querySelectorAll('.menu-item-card');
  const searchInput = document.getElementById('menuSearchInput');
  const resultsBar = document.getElementById('menuResultsBar');
  const resultsCount = document.getElementById('resultsCount');
  const clearFilterBtn = document.getElementById('clearMenuFilterBtn');

  let activeCategory = 'all';
  let searchQuery = '';

  const applyMenuFilters = () => {
    let visibleCount = 0;

    menuCards.forEach(card => {
      const cardCategories = (card.getAttribute('data-category') || '').toLowerCase();
      const cardTitle = (card.querySelector('.dish-title, .menu-item-title')?.textContent || '').toLowerCase();
      const cardMarathi = (card.querySelector('.dish-marathi-name, .menu-item-subtitle')?.textContent || '').toLowerCase();
      const cardDesc = (card.querySelector('.dish-description, .menu-item-desc')?.textContent || '').toLowerCase();

      const matchesCategory = activeCategory === 'all' || cardCategories.includes(activeCategory);
      const matchesSearch = searchQuery === '' || 
        cardTitle.includes(searchQuery) || 
        cardMarathi.includes(searchQuery) || 
        cardDesc.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (resultsBar && resultsCount) {
      if (searchQuery !== '' || activeCategory !== 'all') {
        resultsBar.style.display = 'flex';
        resultsCount.textContent = `Showing ${visibleCount} item${visibleCount === 1 ? '' : 's'}`;
      } else {
        resultsBar.style.display = 'none';
      }
    }
  };

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-category') || 'all';

      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      applyMenuFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyMenuFilters();
    });
  }

  if (clearFilterBtn) {
    clearFilterBtn.addEventListener('click', () => {
      activeCategory = 'all';
      searchQuery = '';
      if (searchInput) searchInput.value = '';

      filterButtons.forEach(b => {
        if (b.getAttribute('data-category') === 'all') {
          b.classList.add('active');
          b.setAttribute('aria-selected', 'true');
        } else {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        }
      });

      applyMenuFilters();
    });
  }

  // 5. FAQ Accordion Controls (for guide.html and home page)
  const faqButtons = document.querySelectorAll('.faq-question-btn');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      
      // Close other accordions in the same group if desired, or toggle current
      btn.setAttribute('aria-expanded', !isExpanded);
      const answerPane = btn.nextElementSibling;
      if (answerPane && answerPane.classList.contains('faq-answer-pane')) {
        if (!isExpanded) {
          answerPane.style.maxHeight = answerPane.scrollHeight + 'px';
          answerPane.style.padding = '16px 20px';
        } else {
          answerPane.style.maxHeight = null;
          answerPane.style.padding = '0 20px';
        }
      }
    });
  });

  // 6. Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = siteHeader ? siteHeader.offsetHeight + 10 : 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});

