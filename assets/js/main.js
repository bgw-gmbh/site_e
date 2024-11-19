/**
* Template Name: UpConstruction
* Template URL: https://bootstrapmade.com/upconstruction-bootstrap-construction-website-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

})();


// 引入 PDF.js
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js';

// 初始化变量
let pdfDoc = null;
let currentPage = 1;
let canvas = document.getElementById('pdf-canvas');
let ctx = canvas.getContext('2d');
let pdfFilePath = '';

// 渲染 PDF 页面
const containerWidth = 800; // 固定容器宽度（可根据设计调整）
const containerHeight = 600; // 固定容器高度

function renderPage(pageNumber) {
  pdfDoc.getPage(pageNumber).then((page) => {
    const viewport = page.getViewport({ scale: 1 }); // 默认缩放比例
    const scaleX = containerWidth / viewport.width; // 宽度缩放比例
    const scaleY = containerHeight / viewport.height; // 高度缩放比例
    const scale = Math.min(scaleX, scaleY); // 选择较小的缩放比例，保持页面完整显示

    const scaledViewport = page.getViewport({ scale });

    const canvas = document.getElementById('pdf-canvas');
    const context = canvas.getContext('2d');

    // 设置 canvas 尺寸为 PDF 页面缩放后的大小
    canvas.width = scaledViewport.width;
    canvas.height = scaledViewport.height;

    // 渲染 PDF 页面
    const renderContext = {
      canvasContext: context,
      viewport: scaledViewport,
    };
    page.render(renderContext);

    // 更新页面信息
    document.getElementById('page-info').textContent = `第 ${currentPage} 页 / 共 ${pdfDoc.numPages} 页`;
  });
}


// 加载 PDF 文件
const loadPDF = (url) => {
  pdfjsLib.getDocument(url).promise.then((doc) => {
    pdfDoc = doc;
    currentPage = 1;
    renderPage(currentPage);
  });
};

// 翻页功能
document.getElementById('prev-page').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
  }
});

document.getElementById('next-page').addEventListener('click', () => {
  if (currentPage < pdfDoc.numPages) {
    currentPage++;
    renderPage(currentPage);
  }
});

// 菜单点击事件
document.querySelectorAll('.services-list a').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    // 移除之前的激活状态
    document.querySelector('.services-list a.active').classList.remove('active');

    // 设置当前激活项
    e.target.classList.add('active');

    // 加载对应的 PDF 文件
    pdfFilePath = e.target.getAttribute('data-pdf');
    loadPDF(pdfFilePath);
  });
});

// 全屏功能
document.getElementById('fullscreen-btn').addEventListener('click', () => {
  const canvas = document.getElementById('pdf-canvas');
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch((err) => {
      console.error(`全屏失败: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
});

// 监听全屏切换事件
document.addEventListener('fullscreenchange', () => {
  const canvas = document.getElementById('pdf-canvas');
  if (document.fullscreenElement) {
    // 获取屏幕宽高
    const fullscreenWidth = screen.width;
    const fullscreenHeight = screen.height;

    pdfDoc.getPage(currentPage).then((page) => {
      const viewport = page.getViewport({ scale: 1 });

      // 计算全屏时的缩放比例
      const scaleX = fullscreenWidth / viewport.width;
      const scaleY = fullscreenHeight / viewport.height;
      const scale = Math.min(scaleX, scaleY); // 保证页面完整显示

      const scaledViewport = page.getViewport({ scale });

      // 设置 canvas 尺寸为全屏下的 PDF 页面大小
      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      const context = canvas.getContext('2d');
      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport,
      };

      page.render(renderContext);
    });
  } else {
    // 退出全屏，恢复到固定窗口显示
    renderPage(currentPage);
  }
});


// 修正翻页逻辑
document.addEventListener("keydown", function(event) {
  if (document.fullscreenElement) {
    switch (event.key) {
      case "ArrowRight": // 下一页
      case "PageDown":
        if (currentPage < pdfDoc.numPages) {
          currentPage++;
          renderPage(currentPage);
        }
        break;
      case "ArrowLeft": // 上一页
      case "PageUp":
        if (currentPage > 1) {
          currentPage--;
          renderPage(currentPage);
        }
        break;
    }
  }
});



// 禁止右键菜单以防止下载
document.addEventListener('contextmenu', (event) => event.preventDefault());

// 默认加载第一个 PDF 文件
loadPDF(document.querySelector('.services-list a.active').getAttribute('data-pdf'));


