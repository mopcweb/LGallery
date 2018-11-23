;(function() {
  'use strict';

  function LGallery(options) {
    // Счетчик вызовов плагина
    LGallery.prototype._count ++;

    // При первом вызове галереи на странице устанавливаем стили и мета-теги
    if (LGallery.prototype._count < 2) {
      // Устанавливаем обязательные мета-теги, при их отсутствии
      if (!document.head.querySelector('[width="device-width, initial-scale=1"]')) {
        let viewport = document.createElement('meta')
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1';
        document.head.appendChild(viewport);
      };

      if (!document.head.querySelector('[name="HandheldFriendly"]')) {
        let handheld = document.createElement('meta')
        handheld.name = 'HandheldFriendly';
        handheld.content = 'True';
        document.head.appendChild(handheld);
      };

      // Подключаем стили при их отсутствии
      if (!document.head.querySelector('[href="lgallery.min.css"]')) {
        let css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href= 'css/lgallery.min.css';
        document.head.appendChild(css);
      };
    };

    // Создаем приватные свойства родителя и объекта опций
    this._parent = options.parent;
    this._parent.style.position = 'relative';
    this._options = options;

    // Задаем тип галереи/слайдера
    // data-lgallery
    if (this._parent.dataset.lgallery != undefined) {
      // Делаем массив из картинок указанных в data-lgallery
      this._src = this._parent.dataset.lgallery.split(',');
      // Создаем переменную типа галереи/слайдера
      this._type = 'lgallery';
      // Убираем данные из дата-атрибута в HTML
      this._parent.setAttribute('data-lgallery', '');
    };
    // data-lgslider
    if (this._parent.dataset.lgslider != undefined) {
      this._src = this._parent.dataset.lgslider.split(',');
      this._type = 'lgslider';
      this._parent.setAttribute('data-lgslider', '');
    };
    // data-lgpreview
    if (this._parent.dataset.lgpreview != undefined) {
      this._src = this._parent.dataset.lgpreview.split(',');
      this._type = 'lgpreview';
      this._parent.setAttribute('data-lgpreview', '');
    };
    // data-lgparent
    if (this._parent.dataset.lgparent != undefined) {
      // Делаем масив из картинок-детей элемента с в data-lgparent
      this._src = Array.prototype.slice.call(this._parent.querySelectorAll('img'));
      this._type = 'lgparent';
      this._parent.setAttribute('data-lgparent', '')
    };
    // data-lgcarusel
    if (this._parent.dataset.lgcarusel != undefined) {
      this._src = this._parent.dataset.lgcarusel.split(',');
      this._type = 'lgcarusel';

      if (this._parent.dataset.lgcarusel == '') {
        this._src = this._parent.children;
        this._mod = 'custom'
      };

      this._parent.setAttribute('data-lgcarusel', '');
    };

    // Создаем массив с картинками для планшетов и мобильных телефонов
    // Опции
    if (this._options.tabletsrc) {
      this._tabletsrc = this._options.tabletsrc.split(',');
    };
    if (this._parent.dataset.lgtabletsrc) {
      this._tabletsrc = this._parent.dataset.lgtabletsrc.split(',');
      this._parent.removeAttribute('data-lgtabletsrc');
    };
    // Дата атрибуты
    if (this._options.mobilesrc) {
      this._mobilesrc = this._options.mobilesrc.split(',');
    };
    if (this._parent.dataset.lgmobilesrc) {
      this._mobilesrc = this._parent.dataset.lgmobilesrc.split(',');
      this._parent.removeAttribute('data-lgmobilesrc');
    };

    // Создаем массив с альтами и тайтлами
    // Опции
    if (this._options.alt) {
      this._alts = this._options.alt.split(',');
    };
    if (this._options.title) {
      this._titles = this._options.title.split(',');
    };
    // Дата атрибуты
    if (this._parent.dataset.lgalt) {
      this._alts = this._parent.dataset.lgalt.split(',');
      this._parent.removeAttribute('data-lgalt');
    };
    if (this._parent.dataset.lgtitle) {
      this._titles = this._parent.dataset.lgtitle.split(',');
      this._parent.removeAttribute('data-lgtitle');
    };

    // Labels
    if (this._options.label) {
      this._labels = this._options.label.split(',');
    };
    if (this._parent.dataset.lglabel) {
      this._labels = this._parent.dataset.lglabel.split(',');
      this._parent.removeAttribute('data-lglabel');
    };

    // Labels
    if (this._options.description) {
      this._descriptions = this._options.description.split(',');
    };
    if (this._parent.dataset.lgdescription) {
      this._descriptions = this._parent.dataset.lgdescription.split(',');
      this._parent.removeAttribute('data-lgdescription');
    };

    // Кнопка открытия
    if (this._options.openbtn) this._openbtn = this._options.openbtn
    if (this._parent.dataset.lgopenbtn != undefined) {
      this._openbtn = this._parent.dataset.lgopenbtn;
      this._parent.removeAttribute('data-lgopenbtn')
    };

    if (this._options.noopenbtn) this._noopenbtn = this._options.noopenbtn
    if (this._parent.dataset.lgnoopenbtn != undefined) {
      this._noopenbtn = this._parent.dataset.lgnoopenbtn;
      this._parent.removeAttribute('data-lgnoopenbtn')
    };

    // Убираем эффекты transform при наведении на родителя
    if (this._parent.dataset.lghover != undefined) {
      if (document.body.clientWidth > 1024) this._hover = +parseInt(this._parent.dataset.lghover);
      this._parent.removeAttribute('data-lghover');
      this._initialStyle = this._parent.getAttribute('style');
    };

    // Width in lgallery & lgparent
    if (this._options.width && this._type == 'lgallery' || this._options.width && this._type == 'lgparent') {
      this._width = this._options.width;
    };
    if (this._parent.dataset.lgwidth && this._type == 'lgallery' || this._parent.dataset.lgwidth && this._type == 'lgparent') {
      this._width = this._parent.dataset.lgwidth;
      this._parent.removeAttribute('data-lgwidth')
    };

    // Height in lgallery & lgparent
    if (this._options.height && this._type == 'lgallery' || this._options.height && this._type == 'lgparent') {
      this._height = this._options.height;
    };
    if (this._parent.dataset.lgheight && this._type == 'lgallery' || this._parent.dataset.lgheight && this._type == 'lgparent') {
      this._height = this._parent.dataset.lgheight;
      this._parent.removeAttribute('data-lgheight')
    };

    // Noscale effect in lgallery & lgparent
    if (this._options.noscale && this._type == 'lgallery' || this._options.noscale && this._type == 'lgparent') {
      this._noscale = this._options.noscale;
    };
    if (this._parent.dataset.lgnoscale != undefined && this._type == 'lgallery' || this._parent.dataset.lgnoscale != undefined && this._type == 'lgparent') {
      this._noscale = this._parent.dataset.lgnoscale;
      this._parent.removeAttribute('data-lgnoscale')
    };

    // Render for lgallery & lgparent
    if (this._options.render) this._render = this._options.render
    if (this._parent.dataset.lgrender != undefined) {
      this._render = this._parent.dataset.lgrender;
      this._parent.removeAttribute('data-lgrender')
    };

    // Animation time in lgallery & lgparent & lgslider & lgpreview
    if (this._options.atime && this._type != 'lgcarusel') {
      this._atime = this._options.atime;
    };
    if (this._parent.dataset.lgatime && this._type != 'lgcarusel') {
      this._atime = this._parent.dataset.lgatime;
      this._parent.removeAttribute('data-lgatime');
    };

    // Autoplay in lgallery & lgparent & lgslider & lgcarusel
    if (this._options.autoplay) this._autoplay = this._options.autoplay;
    if (this._parent.dataset.lgautoplay) {
      this._autoplay = this._parent.dataset.lgautoplay;
      this._parent.removeAttribute('data-lgautoplay');
    };

    // Keyboard press on lgslider & lgpreview
    if (this._type == 'lgslider' || this._type == 'lgpreview') {
      this._keyboard = true
    };

    // ThumbsOffset in lgpreview
    this._margin = '0px';
    if (this._options.thumbsoffset) this._margin = this._options.thumbsoffset;
    if (this._parent.dataset.lgthumbsoffset) {
      this._margin = this._parent.dataset.lgthumbsoffset;
      this._parent.removeAttribute('data-lgthumbsoffset');
    };

    // Thumb container in lgpreview
    if (this._options.thumbcontainer) {
      this._thumbcontainer = this._options.thumbcontainer;
    };
    if (this._parent.dataset.lgthumbcontainer) {
      this._thumbcontainer = this._parent.dataset.lgthumbcontainer;
      this._parent.removeAttribute('data-lgthumbcontainer');
    };

    // Thumb height in lgpreview
    if (this._options.thumbheight) {
      this._thumbheight = this._options.thumbheight;
    };
    if (this._parent.dataset.lgthumbheight) {
      this._thumbheight = this._parent.dataset.lgthumbheight;
      this._parent.removeAttribute('data-lgthumbheight');
    };

    // Each thumb width in lgpreview
    if (this._options.thumbwidth) {
      this._thumbwidth = this._options.thumbwidth
    };
    if (this._parent.dataset.lgthumbwidth) {
      this._thumbwidth = this._parent.dataset.lgthumbwidth;
      this._parent.removeAttribute('data-lgthumbwidth');
    };

    // Each thumb margin left + right (unless leftmargin of 1st & rightmargin of last one) in lgpreview
    if (this._options.thumbmargin) {
      this._thumbmargin = this._options.thumbmargin
    };
    if (this._parent.dataset.lgthumbmargin) {
      this._thumbmargin = this._parent.dataset.lgthumbmargin
      this._parent.removeAttribute('data-lgthumbmargin');
    };

    // Showing slides in lgcarusel
    if (this._options.showslides) this._showslides = parseInt(this._options.showslides);
    if (this._parent.dataset.lgshowslides) {
      this._showslides = parseInt(this._parent.dataset.lgshowslides);
      this._parent.removeAttribute('data-lgshowslides');
    };

    // Slides per click in lgcarusel
    if (this._options.slidesperclick) this._slidesperclick = parseInt(this._options.slidesperclick);
    if (this._parent.dataset.lgslidesperclick) {
      this._slidesperclick = parseInt(this._parent.dataset.lgslidesperclick);
      this._parent.removeAttribute('data-lgslidesperclick');
    };

    // Each slide margin left + right (unless leftmargin of 1st & rightmargin of last one) in lgcarusel
    if (this._options.margin) this._slidesmargin = parseInt(this._options.margin);
    if (this._parent.dataset.lgmargin) {
      this._slidesmargin = parseInt(this._parent.dataset.lgmargin);
      this._parent.removeAttribute('data-lgmargin');
    };

    // Width in lgcarusel
    if (this._options.width) this._slidewidth = parseInt(this._options.width);
    if (this._parent.dataset.lgwidth) {
      this._slidewidth = parseInt(this._parent.dataset.lgwidth);
      this._parent.removeAttribute('data-lgwidth');
    };

    // Создание кнопки открытия и запуска галереи
    this._createLink()
  };

  // ------------ Методы --------------

  // Счетчик вызовов плагина
  LGallery.prototype._count = 0;

  // Создаем элемент(ы)-ссылку(и). При клике он(они) запускает(ют) рендер галереи и слайдера и открывает(ют) галерею
  LGallery.prototype._createLink = function() {
    // Действия для data-lgallery
    if (this._type == 'lgallery') {
      // Создаем кнопку открытия галереи
      let OpenBtn = document.createElement('span');
      OpenBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M304 192v32c0 6.6-5.4 12-12 12h-56v56c0 6.6-5.4 12-12 12h-32c-6.6 0-12-5.4-12-12v-56h-56c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h56v-56c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v56h56c6.6 0 12 5.4 12 12zm201 284.7L476.7 505c-9.4 9.4-24.6 9.4-33.9 0L343 405.3c-4.5-4.5-7-10.6-7-17V372c-35.3 27.6-79.7 44-128 44C93.1 416 0 322.9 0 208S93.1 0 208 0s208 93.1 208 208c0 48.3-16.4 92.7-44 128h16.3c6.4 0 12.5 2.5 17 7l99.7 99.7c9.3 9.4 9.3 24.6 0 34zM344 208c0-75.2-60.8-136-136-136S72 132.8 72 208s60.8 136 136 136 136-60.8 136-136z"/></svg>';
      OpenBtn.className = 'LGallery-OpenBtn';

      // вставляем в документ кнопку открытия галереи
      this._parent.appendChild(OpenBtn);

      // Обработчик для открытия галереи при клике на родителя
      this._parent.onclick = this._initGallery.bind(this);

      // Обработчик для открытия галереи только при клике на кнопку Открытия (и убираем обработчик с родителя)
      if (this._openbtn) {
        OpenBtn.addEventListener('click', this._initGallery.bind(this));
        this._parent.onclick = null;
      };
      // Убрать кнопку открытия при ненадобности
      if (this._noopenbtn) {
        this._parent.removeChild(OpenBtn);
      };
    };

    // Действия для data-lgparent
    if (this._type == 'lgparent') {
      for (let i = 0; i < this._src.length; i++) {
        // Ставим обработчик для открытия галереи при клике на картинке-ссылке
        this._src[i].addEventListener('click', this._initGallery.bind(this));
        this._src[i].style.cursor = "pointer"
      };
    };

    // data-lgslider
    if (this._type == 'lgslider') {
      this._initGallery.call(this)
    };

    // Действия для data-lgpreview
    if (this._type == 'lgpreview') {
      this._initGallery.call(this)
    };

    // Действия для data-lgcarusel
    if (this._type == 'lgcarusel') {
      if (!this._parent.contains(this._LGCarusel)) this._renderCarusel.call(this);

      this._renderCaruselSlider.call(this);
    }
  };

  // Обработчик открытия галереи
  LGallery.prototype._initGallery = function(e) {
    // Т.к. обработчик у нас висит на всем родителе, а галерея является его ребенком, отсеиваем лишние клики при открытой галерее
    if (this._type != 'lgslider' && this._type != 'lgpreview') {
      if (e.target.closest('.LGallery')) return;
    };

    // Запоминаем текущую ссылку для открытия нужного слайда в развернутой галерее
    if (this._type == 'lgparent') {
      this._clickedLink = e.target.closest('img');
    };
    // Указываем значение текущего слайда для счетчика слайдов
    if (this._type == 'lgparent' && this._Counter) {
      this._Counter.innerHTML = (this._src.indexOf(this._clickedLink) + 1) + ' / ' + this._src.length
    };
    if (this._type == 'lgallery' && this._Counter) {
      this._Counter.innerHTML = 1 + ' / ' + this._src.length
    };

    if (this._labels && this._Label) {
      if (this._type == 'lgallery') {
        this._Label.classList.remove('LGallerySlider-Label_hidden');
        this._Label.textContent = this._labels[0];
      };
      if (this._type == 'lgparent') {
        this._Label.textContent = this._labels[this._src.indexOf(this._clickedLink)];
      }
    };
    if (this._descriptions && this._LabelDescription) {
      if (this._type == 'lgallery') {
        this._LabelDescription.textContent = this._descriptions[0];
      };
      if (this._type == 'lgparent') {
        this._LabelDescription.textContent = this._descriptions[this._src.indexOf(this._clickedLink)];
      };
      this._Label.appendChild(this._LabelDescription);
    };


    // Запускаем рендер галереи при ее вызове первый раз
    if (!this._parent.contains(this._Gallery)) this._renderGallery.call(this);

    // Убираем эффекты transform при наведении на родителя
    if (this._type == 'lgallery' && this._hover) {
      if (document.body.clientWidth > 1024) {
        this._parent.style.transition = 'all ' + (this._hover ? this._hover/1000 : 0.1) + 's';
        this._parent.style.transform = 'none';
        this._parent.style.boxShadow = 'none';
      }
    };

    if (this._type == 'lgpreview') this._renderPreviewBlock.call(this);

    // Проверяем родителя на наличие лишних галерей (например, при одновременном вызове функций findLG и createLG. Так лучше не делать, что и описано в документации, но на всякий случай добавим проверку)
    let oldGalleries = this._parent.querySelectorAll('.LGallery');
    let i = oldGalleries.length;
    while (i > 1) {
      this._parent.removeChild(this._parent.lastElementChild.previousElementSibling);
      i--
    };

    // Для того, что бы была анимация появления галереи ставим в очередь изменение класса после ее рендера
    setTimeout(() => {
      // Открываем галерею и убираем прокрутку документа во время открытой галереи. Кроме lgslider & lgpreview
      if (this._type != 'lgslider' && this._type != 'lgpreview') {
        this._Gallery.classList.add('LGallery_open');
        document.body.classList.add('LGalleryBody_hidden');
      };

      // Запускаем рендер слайдера
      this._renderSlider.call(this);
    }, this._hover ? this._hover : 0)
  };

  // Создаем HTML структуру LGallery
  LGallery.prototype._renderGallery = function() {
    // Контейнер галереи (фиксированное позиционирование поверх всего, затемненный фон)
    this._Gallery = document.createElement('div');
    this._Gallery.classList.add('LGallery');

    // Кнопка закрытия
    this._Close = document.createElement('span');
    this._Close.classList.add('LGallery-CloseBtn');
    this._Close.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>';

    // Кнопка Fullscreen
    this._Fullscreen = document.createElement('span');
    this._Fullscreen.classList.add('LGallery-FullscreenBtn');
    this._Fullscreen.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g id="background"><rect fill="none"/></g><g id="fullscreen"><path d="M20,8l8,8V8H20z M4,24h8l-8-8V24z"/><path d="M32,28V4H0v24h14v2H8v2h16v-2h-6v-2H32z M2,26V6h28v20H2z"/></g></svg>';

    // Кнопка Play
    this._Play = document.createElement('span');
    this._Play.classList.add('LGallery-PlayBtn');
    this._Play.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"/></svg>';

    // Кнопка Pause
    this._Pause = document.createElement('span');
    this._Pause.classList.add('LGallery-PauseBtn');
    this._Pause.classList.add('LGallery-PauseBtn_hidden');
    this._Pause.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"/></svg>';

    // Кнопка Counter
    this._Counter = document.createElement('span');
    this._Counter.classList.add('LGallery-Counter');
    // Для lgallery листаем все время с начала
    if (this._type == 'lgallery') {
      this._Counter.innerHTML = 1 + ' / ' + this._src.length
    };
    // // Для lgparent листаем с того слайда, которым открыли галерею. Обновление этого счетчика в дальнейшем при уже отрендериной галерее происходит рядом с местом, где присваивается значение this._clickedLink
    if (this._type == 'lgparent') {
      this._Counter.innerHTML = (this._src.indexOf(this._clickedLink) + 1) + ' / ' + this._src.length
    };

    // Menu line
    this._Menubar = document.createElement('span');
    this._Menubar.classList.add('LGallery-Menubar');

    // Контейнер слайдера (для контейнера слайдов и кнопок след/пред слайд)
    this._Slider = document.createElement('div');
    this._Slider.classList.add('LGallerySlider');
    if (this._type == 'lgslider') {
      this._Slider.classList.add('LGallerySlider_lgslider');
    };

    // Label
    this._Label = document.createElement('div');
    this._Label.classList.add('LGallerySlider-Label');
    // Если есть массив с текстом - вставляем и определяем первый из них
    if (this._labels) {
      if (this._type != 'lgparent') {
        this._Label.textContent = this._labels[0];
        if (this._labels[0] == undefined || this._labels[0] == '') this._Label.classList.add('LGallerySlider-Label_hidden')
      };
      if (this._type == 'lgparent') {
        this._Label.textContent = this._labels[this._src.indexOf(this._clickedLink)];
      }
    };

    this._LabelDescription = document.createElement('span');
    this._LabelDescription.classList.add('LGallerySlider-LabelDescription');
    // Аналогично
    if (this._descriptions) {
      if (this._type != 'lgparent') {
        this._LabelDescription.textContent = this._descriptions[0];
        if (this._descriptions[0] == undefined || this._descriptions[0] == '') this._Label.classList.add('LGallerySlider-Label_hidden')
      };
      if (this._type == 'lgparent') {
        this._LabelDescription.textContent = this._descriptions[this._src.indexOf(this._clickedLink)];
      };
    };

    this._Label.appendChild(this._LabelDescription);

    // Контейнер слайдов
    this._SliderInner = document.createElement('div');
    this._SliderInner.classList.add('LGallerySlider-Inner');

    // Наполняем слайдер картинками
    for (let i = 0; i < this._src.length; i++) {
      // Если пустое значение или undefined - пропускаем слайд
      if (this._src[i] == undefined || this._src[i] == '') continue;

      // Создаем элемент - слайд
      let picture = document.createElement('picture');
      let SliderSlide = document.createElement('img');
      SliderSlide.classList.add('LGallerySlider-Slide');

      // При data-lgallery устанавливаем следующие параметры
      if (this._type == 'lgallery') {
        SliderSlide.src = this._src[i];
        SliderSlide.alt = 'LGallery slide ' + i;
        if (i == 0) SliderSlide.classList.add('LGallerySlider-Slide_showing');
      };
      // При data-lgparent устанавливаем следующие параметры
      if (this._type == 'lgparent') {
        SliderSlide.src = this._src[i].src;
        if (this._src[i].alt) SliderSlide.alt = this._src[i].alt;
        if (this._src[i].title) SliderSlide.title = this._src[i].title;
        if (i == this._src.indexOf(this._clickedLink)) SliderSlide.classList.add('LGallerySlider-Slide_showing');
      };
      // При data-lgslider устанавливаем следующие параметры
      if (this._type == 'lgslider' || this._type == 'lgpreview') {
        SliderSlide.src = this._src[i];
        SliderSlide.alt = 'LGallery slide ' + i;
        SliderSlide.classList.add('LGallerySlider-Slide_lgslider');
        if (i == 0) SliderSlide.classList.add('LGallerySlider-Slide_showing');
      };

      // Картинки для мобильных и планшетов
      if (this._mobilesrc) {
        let source = document.createElement('source');
        source.media = '(max-width: ' + this._mobilesrc[0] +  ')';
        source.srcset = this._mobilesrc[i + 1];

        picture.appendChild(source);
      };

      if (this._tabletsrc) {
        let source = document.createElement('source');
        source.media = '(max-width: ' + this._tabletsrc[0] +  ')';
        source.srcset = this._tabletsrc[i + 1];

        picture.appendChild(source);
      };

      // Alt
      if (this._alts) SliderSlide.alt = this._alts[i];

      // Title
      if (this._titles) SliderSlide.title = this._titles[i];

      // Вставляем слайд в галерею
      picture.appendChild(SliderSlide);
      this._SliderInner.appendChild(picture);

      // Убираем стандартное HTML drag & drop, чтобы не мешало нашему свайпу вверх/вниз
      SliderSlide.ondragstart = function() {return false};

      // Проверка на наличие значений в атрибуте style, чтобы не потерять их при перезаписи
      let hasStyle = SliderSlide.getAttribute('style');

      // Кастомные опции объекта
      // Только для lgallery и lgparent
      if (this._width) {
        SliderSlide.setAttribute('style', (hasStyle ? hasStyle + ';' : '') + ';width: ' + this._width + ' !important');
        hasStyle = SliderSlide.getAttribute('style');
      };
      if (this._height) {
        SliderSlide.setAttribute('style', (hasStyle ? hasStyle + ';' : '') + ';height: ' + this._height + ' !important');
        hasStyle = SliderSlide.getAttribute('style');
      };
      if (this._noscale) {
        SliderSlide.setAttribute('style', (hasStyle ? hasStyle + ';' : '') + ';transform: translate(-50%, -50%) scale(1) !important');
        hasStyle = SliderSlide.getAttribute('style');
      };
      if (this._atime) {
        SliderSlide.setAttribute('style', (hasStyle ? hasStyle + ';' : '') + ';transition: opacity ' + (parseInt(this._atime) * 0.7) + 's, transform ' + this._atime + ' !important');
        hasStyle = SliderSlide.getAttribute('style');
      };

      // Только для lgpreview и lgslider
      if (this._atime) {
        SliderSlide.setAttribute('style', (hasStyle ? hasStyle + ';' : '') + ';transition: opacity ' + this._atime + ', transform ' + this._atime + ' !important');
        hasStyle = SliderSlide.getAttribute('style');
      };
    };

    // Кнопка предыдуший слайд
    this._ButtonPrev = document.createElement('button');
    this._ButtonPrev.className = 'LGallerySlider-Button LGallerySlider-Button_prev';
    this._ButtonPrev.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"/></svg>';

    // Кнопка следующий слайд
    this._ButtonNext = document.createElement('button');
    this._ButtonNext.className = 'LGallerySlider-Button LGallerySlider-Button_next';
    this._ButtonNext.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"/></svg>';

    // Вставляем сначала все элементы в родельские контейнеры вплоть до контейнера галереи и только потом вставляем его в документ в целях оптимизации. Для lgallery & lgparent
    if (this._type == 'lgallery' || this._type == 'lgparent') {
      this._Slider.appendChild(this._SliderInner);
      // Не вставляем кнопки след/пред слайд при условии, что слайд только 1
      if (this._src.length > 1) {
        this._Slider.appendChild(this._ButtonPrev);
        this._Slider.appendChild(this._ButtonNext);
      };
      this._Gallery.appendChild(this._Close);
      this._Gallery.appendChild(this._Fullscreen);
      this._Gallery.appendChild(this._Play);
      this._Gallery.appendChild(this._Pause);
      this._Gallery.appendChild(this._Counter);
      this._Gallery.appendChild(this._Menubar);
      if (this._labels || this._descriptions) this._Gallery.appendChild(this._Label);
      this._Gallery.appendChild(this._Slider);
      this._parent.appendChild(this._Gallery);
    };

    // Для lgslider
    if (this._type == 'lgslider') {
      this._Slider.appendChild(this._SliderInner);
      // Не вставляем кнопки след/пред слайд при условии, что слайд только 1
      if (this._src.length > 1) {
        this._Slider.appendChild(this._ButtonPrev);
        this._Slider.appendChild(this._ButtonNext);
      };
      if (this._labels || this._descriptions) this._Slider.appendChild(this._Label);
      this._parent.appendChild(this._Slider);
    };
  };

  // Создаем HTML структуру LGPreview

  LGallery.prototype._renderPreviewBlock = function() {
    this._LGPreview = document.createElement('div');
    this._LGPreview.classList.add('LGSliderWithPreview');

    this._LGThumbs = document.createElement('div');
    this._LGThumbs.classList.add('LGSliderWithPreview-Thumbs');
    this._LGThumbs.style.marginTop = this._margin;

    // Корректируем высоту слайдера на this._margin
    this._Slider.setAttribute('style','height: calc(100% - ' + this._margin + ' - 50px) !important');

    // let hasStyle = this._LGThumbs.getAttribute('style');
    // Кастомные опции
    if (this._thumbcontainer) {
      // this._LGThumbs.setAttribute('style', (hasStyle ? hasStyle + ';' : '') + ';width: ' + this._parent.dataset.lgthumbcontainer + ' !important');
      // hasStyle = this._LGThumbs.getAttribute('style');
      this._LGThumbs.style.width = this._thumbcontainer
    }
    if (this._thumbheight) {
      // this._LGThumbs.setAttribute('style', (hasStyle ? hasStyle + ';' : '') + ';height: ' + this._parent.dataset.lgthumbheight + ' !important');
      // hasStyle = this._LGThumbs.getAttribute('style');
      this._LGThumbs.style.height = this._thumbheight

      this._Slider.setAttribute('style','height: calc(100% - ' + this._margin + ' - ' + this._thumbheight + ') !important');
    }

    this._LGThumbsContainer = document.createElement('div');
    this._LGThumbsContainer.classList.add('LGSliderWithPreview-ThumbsContainer');

    for (let i = 0; i < this._src.length; i++) {
      let thumb = document.createElement('img');
      thumb.classList.add('LGSliderWithPreview-Thumb');
      thumb.src = this._src[i];
      this._LGThumbsContainer.appendChild(thumb);

      if (i == 0) thumb.classList.add('LGSliderWithPreview-Thumb_active');

      // let hasStyle = thumb.getAttribute('style');
      // Кастомные опции
      if (this._thumbwidth) {
        // thumb.setAttribute('style', (hasStyle ? hasStyle + ';' : '') + ';width: ' + this._thumbwidth + ' !important');
        // hasStyle = thumb.getAttribute('style');
        thumb.style.width = this._thumbwidth
      };
      if (this._thumbmargin) {
        thumb.style.margin = '0 ' + this._thumbmargin
      };
    };

    this._LGThumbs.appendChild(this._LGThumbsContainer);
    this._Slider.appendChild(this._SliderInner);
    // Не вставляем кнопки след/пред слайд при условии, что слайд только 1
    if (this._src.length > 1) {
      this._Slider.appendChild(this._ButtonPrev);
      this._Slider.appendChild(this._ButtonNext);
    };
    if (this._labels || this._descriptions) this._Slider.appendChild(this._Label);
    this._LGPreview.appendChild(this._Slider);
    this._LGPreview.appendChild(this._LGThumbs);
    this._parent.appendChild(this._LGPreview);
  };

  // ЛОГИКА РАБОТЫ СЛАЙДЕРА

  LGallery.prototype._renderSlider = function() {
    // Массив слайдов
    let slides = this._Slider.querySelectorAll('.LGallerySlider-Slide');

    // Массив labels
    let labels = this._Slider.querySelectorAll('.LGallerySlider-Label');

    // Переменные и функционал ТОЛЬКО для lgpreview
    let thumbs, thumbCoords, thumbWidth, centerOfThumbs, distance, thumbsContWidth, client, thumbMargin;
    if (this._type == 'lgpreview') {
      client = document.body.clientWidth

      // Массив миниатюр
      thumbs = this._LGThumbsContainer.querySelectorAll('img');

      // Начальные координаты активной миниатюры
      thumbCoords = 0;

      // Ширина миниатюры
      thumbWidth = 50;
      if (this._thumbwidth) thumbWidth = +parseInt(this._thumbwidth);

      // Thumb margin
      thumbMargin = 0;
      if (this._thumbmargin) thumbMargin = +parseInt(this._thumbmargin);

      // Ширина контейнера миниатюр
      thumbsContWidth = 450;
      if (this._thumbcontainer) {
        let value = this._thumbcontainer.slice(-1);
        switch (value) {
          case 'x':
            thumbsContWidth = +parseInt(this._thumbcontainer)
            break;

          case '%':
            thumbsContWidth = this._parent.clientWidth * parseInt(this._thumbcontainer) / 100
            break
        }
      };
      // Если больше родителя = ширине родителя
      if (thumbsContWidth > this._parent.clientWidth) thumbsContWidth = this._parent.clientWidth;

      this._LGThumbs.style.width = thumbsContWidth + 'px'

      // Адаптив
      let adaptPreview = () => {
        let thumbsHeight;

        if (document.body.clientWidth > 1023) {
          thumbsContWidth = 450;
          if (this._thumbcontainer) {
            let value = this._thumbcontainer.slice(-1);
            switch (value) {
              case 'x':
                thumbsContWidth = +parseInt(this._thumbcontainer)
                break;

              case '%':
                thumbsContWidth = this._parent.clientWidth * parseInt(this._thumbcontainer) / 100
                break
            }
          };
          // Если больше родителя = ширине родителя
          if (thumbsContWidth > this._parent.clientWidth) thumbsContWidth = this._parent.clientWidth;

          thumbWidth = 50;
          if (this._thumbwidth) thumbWidth = +parseInt(this._thumbwidth);

          for (let i = 0; i < thumbs.length; i++) {
            thumbs[i].style.width = thumbWidth + 'px'
          };

          this._Slider.setAttribute('style','height: calc(100% - ' + this._margin + ' - 50px) !important');
          if (this._thumbheight) {
            this._LGThumbs.style.height = this._thumbheight;

            this._Slider.setAttribute('style','height: calc(100% - ' + this._margin + ' - ' + this._thumbheight + ') !important');
          }
        };
        if (document.body.clientWidth < 769) {
          thumbsHeight = parseInt(getComputedStyle(this._LGThumbs).height);
          if (thumbsHeight > 100) thumbsHeight = 100;
          if (thumbsContWidth > this._parent.clientWidth) thumbsContWidth = this._parent.clientWidth;
          if (thumbWidth > 150) thumbWidth = thumbsContWidth / 4;

          for (let i = 0; i < thumbs.length; i++) {
            thumbs[i].style.width = thumbWidth + 'px'
          };

          // this._LGThumbs.style.width = thumbsContWidth + 'px';
          this._LGThumbs.style.height = thumbsHeight + 'px';
          this._Slider.setAttribute('style','height: calc(100% - ' + this._margin + ' - ' + thumbsHeight + 'px) !important');
        };
        if (document.body.clientWidth < 415) {
          thumbsHeight = parseInt(getComputedStyle(this._LGThumbs).height);
          if (thumbsHeight > 80) thumbsHeight = 80;
          if (thumbWidth > 100) thumbWidth = thumbsContWidth / 3;

          for (let i = 0; i < thumbs.length; i++) {
            thumbs[i].style.width = thumbWidth + 'px'
          };

          // this._LGThumbs.style.width = thumbsContWidth + 'px';
          this._LGThumbs.style.height = thumbsHeight + 'px';
          this._Slider.setAttribute('style','height: calc(100% - ' + this._margin + ' - ' + thumbsHeight + 'px) !important');
        };


      };
      adaptPreview()

      // Получили средину блока миниатюр узнав левую ее координату и прибавив половину ширины. Цель - отслеживать клики до/после половины ширины.
      centerOfThumbs = this._LGThumbs.getBoundingClientRect().left + thumbsContWidth/2;

      // Получаем максимально кол-во пикселей для перемещения блока миниатюр: из видимой ширины блока миниатюр вычитаем сумму по ширине всех миниатюр (с учетом отсутпов thumbMargin)
      distance = thumbsContWidth - ((thumbs.length) * (thumbWidth + thumbMargin * 2));

      // Обработчик для регулировки прокрутки миниатюр при изменении разрешения экрана + адаптив
      window.addEventListener('resize', () => {
        adaptPreview();

        // Соотношение для использовния далее
        let ratio;
        if (thumbCoords == distance + thumbMargin * 2) ratio = 1;

        // Габариты превью и блока с ними
        thumbWidth = thumbWidth;
        thumbsContWidth = thumbsContWidth;
        if (this._thumbcontainer) {
          let value = this._thumbcontainer.slice(-1);
          switch (value) {
            case 'x':
              thumbsContWidth = +parseInt(this._thumbcontainer)
              break;

            case '%':
              thumbsContWidth = this._parent.clientWidth * parseInt(this._thumbcontainer) / 100
              break
          }
        };
        // Правильно позиционируем и задаем ращмеры блоку превью при изменении размеров экрана
        if (thumbsContWidth > this._parent.clientWidth) thumbsContWidth = this._parent.clientWidth;
        this._LGThumbs.style.width = thumbsContWidth + 'px'

        // Пересчитываем дистанцию
        distance = thumbsContWidth - ((thumbs.length) * (thumbWidth + thumbMargin * 2));

        // Если активная превьюшака последняя - прокручиваем ее к новому краю экрана
        if (ratio == 1) {
          thumbCoords = distance + thumbMargin * 2;
          self._LGThumbs.firstElementChild.style.transform = 'translateX(' + thumbCoords + 'px)';
        };


      });

      // Центруем миниатюры под картинкой, если блок миниатюр меньше видимой области
      if (distance > 0) this._LGThumbs.firstElementChild.style.justifyContent = 'center'
    };

    // Переменная текущего слайда для первого запуска слайдера
    let currentSlide;
    // Устанавливаем ее значение в зависимости от дата-атрибута родителя: lgallery или lgparent
    if (this._type == 'lgallery' || this._type == 'lgslider' || this._type == 'lgpreview') {
      currentSlide = 0;
    };
    if (this._type == 'lgparent') {
      currentSlide = this._src.indexOf(this._clickedLink);
    };
    slides[currentSlide].classList.add('LGallerySlider-Slide_showing');

    // Объект координат для свайпа вправо/влево
    let swipeStart = {}, swipeEnd = {};
    // Координаты для вычисления свайпа вверх/вниз
    let shiftX, shiftY, initialY;

    // Сохранили контекст текущей галереи
    let self = this;

    // Переменные для очистки интервала автопереключения слайдеров и скокрости смены слайдов
    let autoPlayTimer, autoPlayInterval = null;
    if (this._autoplay) autoPlayInterval = this._autoplay;

    // Fullscreen variables
    let isFullscr;

    // Присвоили кнопки в переменные, чтобы сделать им анимацию при кликах и нажатиях
    let btnPrev = this._ButtonPrev;
    let btnNext = this._ButtonNext;

    // Активировал функцию для обработки кликов по кнопка след/пред слайд
    btnsClick.call(this);

    // ---------- СОБЫТИЯ ------------

    // События swipe
    // ПК
    this._Slider.addEventListener('mousedown', swipeStartOnDoc);
    this._Slider.addEventListener('mouseup', swipeEndOnDoc);
    // Для lgslider и lgpreview нам не нужен свайп вверх/вниз
    if (this._type != 'lgslider' && this._type != 'lgpreview') document.addEventListener('mousedown', dragWhileSwipeOnDoc);

    // Тачскрин
    this._Slider.addEventListener('touchstart', swipeStartOnMob);
    this._Slider.addEventListener('touchend', swipeEndOnMob);
    // Для lgslider и lgpreview нам не нужен свайп вверх/вниз
    if (this._type != 'lgslider' && this._type != 'lgpreview') document.addEventListener('touchstart', dragWhileSwipeOnMob);

    // Убираем скролл при свайпе на тачскринах (для lgslider и lgpreview не добавляем)
    if (this._type != 'lgslider' && this._type != 'lgpreview') this._Gallery.addEventListener('touchmove', swipeMoveOnMob);

    document.addEventListener('keydown', goToSlideOnKeyboard);

    // Обработка кликов по документу мимо картинки (влечет закрытие галереи). (для lgslider и lgpreview не добавляем)
    if (this._type != 'lgslider' && this._type != 'lgpreview') document.addEventListener('click', closeGalleryOnRandomClick);

    // Обработка Fullscreen (для lgslider и lgpreview не добавляем)
    if (this._type != 'lgslider' && this._type != 'lgpreview') this._Fullscreen.addEventListener("click", toggleFullScreen);

    // ФУНКЦИИ

    // Функция перехода к слайду n
    function goToSlide(n) {
      if (self._type != 'lgpreview') {
        slides[currentSlide].classList.remove('LGallerySlider-Slide_showing');
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('LGallerySlider-Slide_showing');

        // Counter
        if (self._Counter) self._Counter.innerHTML = (currentSlide + 1) + ' / ' + slides.length;
      };

      // Для lgpreview. Отличие от основной механики тут: также переключается активный класс миниатюры + ограничение слайдера - упирается в конце и начале
      if (self._type == 'lgpreview') {
        slides[currentSlide].classList.remove('LGallerySlider-Slide_showing');
        thumbs[currentSlide].classList.remove('LGSliderWithPreview-Thumb_active');
        currentSlide = n;
        if (n > slides.length - 1) currentSlide = n - 1;
        if (n < 0) currentSlide = n + 1;
        slides[currentSlide].classList.add('LGallerySlider-Slide_showing');
        thumbs[currentSlide].classList.add('LGSliderWithPreview-Thumb_active');
      };

      // Label
      if (self._labels) {
        // Делаем прозрачной Label при отсутствии текста
        self._Label.classList.add('LGallerySlider-Label_hidden');

        // Для плавности анимации смены label делаем отложенное изменение текста и прозрачности
        setTimeout(() => {
          // Сначала убираем предидущий текст (на тот случай, если у слайда нет текста и у него не показывался текст от предидущего)
          self._Label.textContent = '';
          // Проверка: если есть значение (текст) - вставлем его. Если пропуск ('') - считаем, что это пустое место и пропускаем. Период анимации также зависит от atime
          if (self._labels[currentSlide] != '' && self._labels[currentSlide] != undefined) {
            self._Label.classList.remove('LGallerySlider-Label_hidden');
            self._Label.textContent = self._labels[currentSlide];
          }
        }, self._atime ? (parseInt(self._atime) * 1000 / 4) : 300);
      };

      // Label description (Функционал аналогичен для Label)
      if (self._descriptions) {
        setTimeout(() => {
          self._LabelDescription.textContent = '';

          if (self._descriptions[currentSlide] != '' && self._descriptions[currentSlide] != undefined) {
            // Если есть описание но нет Label, также делаем непрозрачним, чтобы можно было показать
            self._Label.classList.remove('LGallerySlider-Label_hidden');
            self._Label.appendChild(self._LabelDescription)
            self._LabelDescription.textContent = self._descriptions[currentSlide];
          }
        }, self._atime ? (parseInt(self._atime) * 1000 / 4) : 300);
      };
    };

    // Обработка изменений слайдов для lgpreview
    function lookForThumbs() {
      // Передвижение рамки вокруг активного thumb при смене слайда
      btnNext.addEventListener('click', function(e) {
        // При клике вперед сдвигаем на ширину миниатюры с учетом отступов thumbMargin
        thumbCoords -= (thumbWidth + thumbMargin * 2);

        // Если достигли максимальной дистанции - останавливаемся (с учетом отсутпов thumbMargin)
        if (thumbCoords < distance) thumbCoords = distance + thumbMargin * 2;
        // if (thumbCoords < distance) thumbCoords = thumbCoords

        // Если блок миниатюр помещается в экран - не перемещаем его
        if (distance < 0) self._LGThumbs.firstElementChild.style.transform = 'translateX(' + thumbCoords + 'px)';
      });
      btnPrev.addEventListener('click', function(e) {
        // Аналогично но в обратную сторону
        thumbCoords += (+thumbWidth + thumbMargin * 2);

        if (thumbCoords > 0) thumbCoords = 0;
        self._LGThumbs.firstElementChild.style.transform = 'translateX(' + thumbCoords + 'px)';
      });

      // Передвижение рамки вокруг активного thumb при кликах на них
      self._LGThumbs.onclick = function(e) {
        // Отсеиваем клики не по миниатюре
        if (e.target.tagName != 'IMG') return

        // В данном случае отслеживаем клики до/после центра блока миниатюр. Механика - та же, что и с кнопками
        if (e.clientX > centerOfThumbs) {
          thumbCoords -= (+thumbWidth + thumbMargin * 2);
          if (thumbCoords < distance) thumbCoords = distance + thumbMargin * 2;
          if (distance < 0) self._LGThumbs.firstElementChild.style.transform = 'translateX(' + thumbCoords + 'px)';
        } else if (e.clientX < centerOfThumbs) {
          thumbCoords += (+thumbWidth + thumbMargin * 2);
          if (thumbCoords > 0) thumbCoords = 0;
          this.firstElementChild.style.transform = 'translateX(' + thumbCoords + 'px)';
        };
      };

      // Обработчики кликов по thumb для переключения слайда
      for (let i = 0; i < thumbs.length; i++) {
        thumbs[i].onclick = function(e) {
          goToSlide(i);
        };
      };
    };

    // Инициализируем функцию для lgpreview
    if (this._type == 'lgpreview') lookForThumbs();

    // Обработчики кликов по кнопкам вперед/назад
    function btnsClick() {
      btnPrev.onclick = function(e) {
        goToSlide(currentSlide - 1);
        animateButton(btnPrev)
      };
      btnNext.onclick = function(e) {
        goToSlide(currentSlide + 1);
        animateButton(btnNext)
      };
    };

    // Анимация при клике по кнопкам вперед/назад или на клавиатуре
    function animateButton(btn) {
      if (self._options.nobtns) return;

      if (self._parent.dataset.lgnobtns == undefined) {
        btn.classList.add('LGallerySlider-Button_clicked')
        setTimeout(function() {
          btn.classList.remove('LGallerySlider-Button_clicked')
        }, 220)
      };
    };

    // Обработчик переключения слайдов клавиатурой + Escape
    function goToSlideOnKeyboard(e) {
      // Сравниваем координаты нашей галереи с верхней и нижней границей видимой области экрана
      let visibleTop = self._parent.getBoundingClientRect().top >= -25;
      let visibleBottom = self._parent.getBoundingClientRect().bottom <= document.documentElement.clientHeight + 25;

      // Для типов lgallery и lgparent - координаты верха и низа берем от самой галереи
      if (self._type == 'lgallery' || self._type == 'lgparent') {
        visibleTop = self._Gallery.getBoundingClientRect().top >= -15;
        visibleBottom = self._Gallery.getBoundingClientRect().bottom <= document.documentElement.clientHeight + 15;
      };

      if (e.keyCode == 37 || e.keyCode == 40) {
        // Для lgslider оставляем стандартными действия браузера для кнопки вниз
        if (self._keyboard && e.keyCode == 40) return;

        // Проверка: если в видимой области - листаем
        if (visibleTop && visibleBottom) {

          goToSlide(currentSlide - 1);
          animateButton(btnPrev);

          // Для lgpreview также листаем миниатюры
          if (self._type == 'lgpreview') {
            thumbCoords += (+thumbWidth + thumbMargin * 2);

            if (thumbCoords > 0) thumbCoords = 0;
            self._LGThumbs.firstElementChild.style.transform = 'translateX(' + thumbCoords + 'px)';
          }
        };

        // Убираем стандартное поведение браузера при клике по кнопкам
        e.preventDefault();
      };
      if (e.keyCode == 39 || e.keyCode == 38) {
        // Для lgslider оставляем стандартными действия браузера для кнопки вверх
        if (self._keyboard && e.keyCode == 38) return;

        // Проверка: если в видимой области - листаем
        if (visibleTop && visibleBottom) {

          goToSlide(currentSlide + 1);
          animateButton(btnNext);

          if (self._type == 'lgpreview') {
            thumbCoords -= (+thumbWidth + thumbMargin * 2);
            if (thumbCoords < distance) thumbCoords = distance + thumbMargin * 2;
            if (distance < 0) self._LGThumbs.firstElementChild.style.transform = 'translateX(' + thumbCoords + 'px)';
          };
        }

        // Убираем стандартное поведение браузера при клике по кнопкам
        e.preventDefault();
      };
      if (e.keyCode == 27) {
        if (!self._keyboard) closeGallery.call(self);
      }
    };

    // Функция автопереключения слайдеров lgallery & lgparent
    function autoPlay() {
      self._Play.classList.add('LGallery-PlayBtn_hidden');
      self._Pause.classList.remove('LGallery-PauseBtn_hidden');
      autoPlayTimer = setInterval(function() {
        goToSlide(currentSlide + 1);
      }, autoPlayInterval ? autoPlayInterval : 3000);
    };

    function autoPlayStop() {
      self._Play.classList.remove('LGallery-PlayBtn_hidden');
      self._Pause.classList.add('LGallery-PauseBtn_hidden');
      clearInterval(autoPlayTimer);
      autoPlayTimer = null
    };

    // Автопроигрывание для lgslider
    if (this._type == 'lgslider' && this._autoplay) {
      let autoPlayTimer = setInterval(function() {
        goToSlide(currentSlide + 1);
      },  autoPlayInterval ? autoPlayInterval : 3000);
    };

    // Обработчик закрытия при клике мимо картинки или кнопки
    function closeGalleryOnRandomClick(e) {
      // Клики по кнопке закрытия
      if (e.target.closest('.LGallery-CloseBtn')) closeGallery.call(self);

      // Клики по кнопке Play
      if (e.target.closest('.LGallery-PlayBtn')) autoPlay();
      if (e.target.closest('.LGallery-PauseBtn')) autoPlayStop();

      // Прерываем если в режиме Fullscreen
      if (isFullscr) return;

      // Клики вне слайда или кнопок управления
      if (!e.target.closest('.LGallerySlider-Slide') && !e.target.closest('.LGallerySlider-Button') && !e.target.closest('.LGallery-FullscreenBtn') && !e.target.closest('.LGallery-PlayBtn') && !e.target.closest('.LGallery-PauseBtn') && !e.target.closest('.LGallery-Counter') && !e.target.closest('.LGallerySlider-Label')) {
        closeGallery.call(self);
      }
    };

    // ОБРАБОТЧИКИ SWIPE

    // Функция переключения слайдов при свайпе
    function swipe() {
      if ((swipeEnd.x - swipeStart.x) < -50) {
        goToSlide(currentSlide + 1);

        // Для lgpreview
        if (self._type == 'lgpreview') {
          thumbCoords -= thumbWidth;
          if (thumbCoords < distance) thumbCoords = distance
          self._LGThumbs.firstElementChild.style.transform = 'translateX(' + thumbCoords + 'px)';
        };
      };
      if ((swipeEnd.x - swipeStart.x) > 50) {
        goToSlide(currentSlide - 1);

        // Для lgpreview
        if (self._type == 'lgpreview') {
          thumbCoords += thumbWidth;
          if (thumbCoords > 0) thumbCoords = 0;
          self._LGThumbs.firstElementChild.style.transform = 'translateX(' + thumbCoords + 'px)';
        };
      };
    };

    // ДЛЯ ПК
    // Запоминаем координаты свайпа в объект на ПК
    function swipeStartOnDoc(e) {
      swipeStart.x = e.clientX;
      swipeStart.y = e.clientY;
    };
    function swipeEndOnDoc(e) {
      // Если курсор над label - не листаем, возможно текст копируют
      if (e.target.closest('.LGallerySlider-Label')) return;

      swipeEnd.x = e.clientX;
      swipeEnd.y = e.clientY;

      // Вызываем функцию при отпускании мыши
      swipe()
    };

    // Свайп картинки вверх/вниз для закрытия на ПК
    function dragWhileSwipeOnDoc(e) {
      // Если смотрим с тачскрина - прерывает функцию
      if ('ontouchstart' in document.documentElement) return;

      // Если Fullscreen - прерывает функцию
      if (isFullscr) return;

      // Запоминаем цель клика для удобства
      let target = e.target;

      // Убираем срабатывание перетаскивания при нажатии правой кнопкой, ctrl или command
      if (e.metaKey || e.ctrlKey || e.which == 3) return

      // Прерываем функцию если перетаскиваемый объект не слайд
      if (!target.classList.contains('LGallerySlider-Slide')) return;

      // Фиксируем первый клик для сравнения и утонения дистанции свайпа похже
      let firstY = e.clientY;
      // Запоминаем сдвиг между координатой сверху цели и местом клика мышкой (чтобы не было резкого скачка при клике)
      shiftY = e.clientY - target.getBoundingClientRect().top;

      // Устанавливаем новые координаты
      moveAt(e);

      // Ставим обработчик на передвижение зажатой мыши с нашим слайдом
      document.addEventListener('mousemove', mouseMove);

      // Ставим обработчик на отпускание мыши
      document.addEventListener('mouseup', mouseUp);

      // Убираем стандартное для браузера действие при mousedown - выделение при двойном клике
      e.preventDefault();

      // Функция-обработчик для mousemove
      function mouseMove(e) {
        moveAt(e)
      };

      // Функция-обработчик для mouseup
      function mouseUp(e) {
        // Закрытие при свайпе более 150 пикселей или возврат назад при менее 150 пикселей
        if ((firstY - e.clientY) > 150 || (firstY - e.clientY) < -150) {
          closeGallery.call(self);

          // Возвращаем слайд на свое место после закрытия (setTimeout чтобы не было резкого скачка)
          setTimeout(function(e) {
            target.style.top = '50%';
          },500)
        } else {
          // Добавляем класс для плавности анимации возврата
          target.classList.add('LGallerySlider-Slide_swiping');

          // Возвращаем на свое место
          target.style.top = '50%';

          // Убираем ненужный класс
          setTimeout(function() {
            target.classList.remove('LGallerySlider-Slide_swiping')
          }, 500)
        };
        // Убираем обработчики с mousemove и mouseup
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);
      };

      // Функция, отвечающая за определение новых координат при mousedown и mousemove
      function moveAt(e) {
        // Drag & Drop вверх/вниз будет работать если протащили более 50 пикселей
        if ((firstY - e.clientY) > 50 || (firstY - e.clientY) < -50) {
          let top = e.clientY - shiftY - 54.5 + target.clientHeight/2;
          target.style.top = top + 'px';
        };
      };
    };

    // ДЛЯ ТАЧСКРИНА (Комментировать все не буду, т.к. действия аналогичны тем, что для ПК, только с учетом событий для тачскрина. Прокомментирую отличия)
    // Запоминаем координаты свайпа в объект на тачскринах
    function swipeStartOnMob(e) {
      swipeStart.x = e.changedTouches[0].pageX;
      swipeStart.y = e.changedTouches[0].pageY;
    };
    function swipeEndOnMob(e) {
      swipeEnd.x = e.changedTouches[0].pageX;
      swipeEnd.y = e.changedTouches[0].pageY;

      swipe()
    };
    // Убираем пролистывание тела документа при отрытой галерее на тачскринах (для них overflow: hidden для body недостаточно)
    function swipeMoveOnMob(e) {
      e.preventDefault();
    };
    // Свайп картинки вверх/вниз для закрытия на тачскринах
    function dragWhileSwipeOnMob(e) {
      // Если Fullscreen - прерывает функцию
      if (isFullscr) return;

      let target = e.target;
      if (!target.classList.contains('LGallerySlider-Slide')) return;

      // Фиксируем первый клик для сравнения и утонения дистанции свайпа позже
      let firstY = e.changedTouches[0].pageY;
      shiftY = e.changedTouches[0].pageY - target.getBoundingClientRect().top;

      moveAt(e);

      document.addEventListener('touchmove', touchMove);
      document.addEventListener('touchend', touchEnd);

      function touchMove(e) {
        moveAt(e);
      };

      function touchEnd(e) {
        // Закрытие при свайпе более 100 пикселей или возврат назад при менее 100 пикселей
        if ((firstY - e.changedTouches[0].pageY) > 100 || (firstY - e.changedTouches[0].pageY) < -100) {
          closeGallery.call(self);

          // Возвращаем слайд на свое место после закрытия (setTimeout чтобы не было резкого скачка)
          setTimeout(function(e) {
            target.style.top = '50%';
          },500)
        } else {
          // Добавляем класс для плавности анимации возврата
          target.classList.add('LGallerySlider-Slide_swiping');

          // Возвращаем на свое место
          target.style.top = '50%';

          // Убираем ненужный класс
          setTimeout(function() {
            target.classList.remove('LGallerySlider-Slide_swiping')
          }, 500)
        };
        document.removeEventListener('touchmove', touchMove);
        document.removeEventListener('touchend', touchEnd);
      };

      function moveAt(e) {
        // Drag & Drop вверх/вниз будет работать если протащили более 50 пикселей
        if ((firstY - e.changedTouches[0].pageY) > 50 || (firstY - e.changedTouches[0].pageY) < -50) {
          let top = e.changedTouches[0].pageY - shiftY - 22.5 + target.clientHeight/2;
          target.style.top = top + 'px';
        }
      };
    };

    // Fullscreen
    function toggleFullScreen() {
      if (!document.fullscreenElement &&    // alternative standard method
          !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
        if (self._Gallery.requestFullscreen) {
          self._Gallery.requestFullscreen();
        } else if (self._Gallery.mozRequestFullScreen) {
          self._Gallery.mozRequestFullScreen();
        } else if (self._Gallery.webkitRequestFullscreen) {
        self._Gallery.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        };

        // Устанавливаем isFullscr знаечие true для отключения свайпа вверх/вниз и кликов вне слайда, которые ведут к закрытию галереи
        isFullscr = true;

        // Прячем кнопки в режиме Fullscreen спустя время неактивности
        hideBtnsInFullScr()
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        };

        // Сбрасываем значение isFullscr
        isFullscr = false;

        // Убираем обработчики с кнопок в режиме Fullscreen при выходе из него
        removeHideBtnsInFullScr()
      }
    };

    // Навешивает обработчики слежения за наведением на кнопки в режиме Fullscreen
    function hideBtnsInFullScr(e) {
      let btns = [self._ButtonPrev,self._ButtonNext,self._Fullscreen,self._Play,self._Pause];

      let timer, timerOnOpen;

      btns.forEach(function(item) {
        item.onmouseenter = function(e) {
          btns.forEach(function(item) {
            item.classList.remove('LGallery_hiddenBtns');
          });
          clearTimeout(timerOnOpen);
          clearTimeout(timer);
        };

        item.onmouseleave = function(e) {
          timer = setTimeout(function() {
            btns.forEach(function(item) {
              item.classList.add('LGallery_hiddenBtns');
            });
          }, 7000)
        };
      });

      timerOnOpen = setTimeout(function() {
        btns.forEach(function(item) {
          item.classList.add('LGallery_hiddenBtns');
        });
      }, 7000);
    };

    // Убирает обработчики слежения за наведением на кнопки в режиме Fullscreen
    function removeHideBtnsInFullScr(e) {
      let btns = [self._ButtonPrev,self._ButtonNext,self._Fullscreen,self._Play,self._Pause];
      btns.forEach(function(item) {
        item.classList.remove('LGallery_hiddenBtns');
        item.onmouseenter = null;
        item.onmouseleave = null
      });
    }

    // Обработчик закрытия (убираем все поставленные обработчики с документа и галереи)
    function closeGallery() {
      this._Gallery.classList.remove('LGallery_open');
      document.body.classList.remove('LGalleryBody_hidden');

      document.removeEventListener('keydown', goToSlideOnKeyboard);
      document.removeEventListener('click', closeGalleryOnRandomClick);

      this._Slider.removeEventListener('mousedown', swipeStartOnDoc);
      this._Slider.removeEventListener('mouseup', swipeEndOnDoc);
      document.removeEventListener('mousedown', dragWhileSwipeOnDoc);

      this._Slider.removeEventListener('touchstart', swipeStartOnMob);
      this._Slider.removeEventListener('touchend', swipeEndOnMob);
      document.removeEventListener('touchstart', dragWhileSwipeOnMob);

      this._Gallery.removeEventListener('touchmove', swipeMoveOnMob);

      this._Fullscreen.removeEventListener("click", toggleFullScreen);
      // Убираем обработчики с кнопок в режиме Fullscreen при выходе из него
      removeHideBtnsInFullScr()

      // Убираем автопроигрывание при закрытии галереи, если оно активно
      if (autoPlayTimer) autoPlayStop();
      autoPlayTimer = null;

      // При закрытии убираем показ у текущего слайда, сбрасываем переменную текущего слайда до 0 и делаем активным первый слайд
      slides[currentSlide].classList.remove('LGallerySlider-Slide_showing');

      // Можно раскомментировать, если не нужна анимация появления картинки при открытии галереи (касается только галареи с атрибутом data-lgallery)
      // if (this._type == 'lgallery') {
        // currentSlide = 0;
        // slides[currentSlide].classList.add('LGallerySlider-Slide_showing');
      // };

      // Возвращаем эффекты transform при наведении на родителя
      if (this._type == 'lgallery' && this._hover) {
        setTimeout(() => {
          this._parent.setAttribute('style', this._initialStyle);
        }, 500);
      };

      // Кастомная опция объекта, при задании которой можно отменить/применить рендер галереи при каждом ее закрытии и открытии повторно. Стандартно - повторный рендер отключен. Если указан дата-атрибут lgrender, данная опция игнорируется
      if (this._render) {
        setTimeout(() => {if (this._parent.contains(this._Gallery)) this._parent.removeChild(this._Gallery)}, 300);
      };
    };
  };

  // LGCARUSEL
  LGallery.prototype._renderCarusel = function() {
    // Т.к. у _LGCarusel свойсто inline-block, установим размер шрифта 0 для родителя, и вернем обратно для _LGCarusel, чтобы убрать ненужные пробелы от браузера
    this._parent.style.fontSize = '0';

    this._LGCarusel = document.createElement('div');
    this._LGCarusel.classList.add('LGCarusel');

    this._LGCaruselSlider = document.createElement('div');
    this._LGCaruselSlider.classList.add('LGCarusel-Slider');

    this._LGCaruselSliderInner = document.createElement('ul');
    this._LGCaruselSliderInner.classList.add('LGCarusel-SliderInner');

    if (this._mod != 'custom') {
      for (let i = 0; i < this._src.length; i++) {
        let Slide = document.createElement('li');
        Slide.classList.add('LGCarusel-Slide');

        let picture = document.createElement('picture');
        let img = document.createElement('img');
        img.src = this._src[i];
        img.alt = 'LGallery slide ' + i;

        if (this._mobilesrc) {
          let source = document.createElement('source');
          source.media = '(max-width: ' + this._mobilesrc[0] +  ')';
          source.srcset = this._mobilesrc[i + 1];

          picture.appendChild(source);
        };

        if (this._tabletsrc) {
          let source = document.createElement('source');
          source.media = '(max-width: ' + this._tabletsrc[0] +  ')';
          source.srcset = this._tabletsrc[i + 1];

          picture.appendChild(source);
        };

        // Убираем стандартное HTML drag & drop, чтобы не мешало нашему свайпу
        Slide.ondragstart = function() {return false};

        // Options
        if (this._options.alt) {
          this._alts = this._options.alt.split(',');
          img.setAttribute('alt', this._alts[i]);
        };
        if (this._options.title) {
          this._titles = this._options.title.split(',');
          img.setAttribute('title', this._titles[i]);
        };

        // Data-attributes
        if (this._parent.dataset.lgalt) {
          this._alts = this._parent.dataset.lgalt.split(',');
          img.setAttribute('alt', this._alts[i]);
        };
        if (this._parent.dataset.lgtitle) {
          this._titles = this._parent.dataset.lgtitle.split(',');
          img.setAttribute('title', this._titles[i]);
        };

        picture.appendChild(img);
        Slide.appendChild(picture);
        this._LGCaruselSliderInner.appendChild(Slide);
      };
    };

    if (this._mod == 'custom') {
      for (let i = 0; i < this._src.length; i++) {
        let Slide = this._src[i];
        i--
        Slide.classList.add('LGCarusel-Slide');

        this._LGCaruselSliderInner.appendChild(Slide);
      }
    }

    // Кнопка предыдуший слайд
    this._LGCaruselButtonPrev = document.createElement('button');
    this._LGCaruselButtonPrev.className = 'LGCarusel-Button LGCarusel-Button_prev';
    this._LGCaruselButtonPrev.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"/></svg>';

    // Кнопка следующий слайд
    this._LGCaruselButtonNext = document.createElement('button');
    this._LGCaruselButtonNext.className = 'LGCarusel-Button LGCarusel-Button_next';
    this._LGCaruselButtonNext.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"/></svg>';

    this._LGCaruselSlider.appendChild(this._LGCaruselSliderInner);
    this._LGCarusel.appendChild(this._LGCaruselSlider);
    this._LGCarusel.appendChild(this._LGCaruselButtonPrev);
    this._LGCarusel.appendChild(this._LGCaruselButtonNext);
    this._parent.appendChild(this._LGCarusel)
  };

  LGallery.prototype._renderCaruselSlider = function() {
    // Массив слайдов
    let slides = this._parent.querySelectorAll('.LGCarusel-Slide');

    // Кол-во пролистываний до переставления контейнера
    let max = slides.length;

    // Basics
    let initialActiveSlides = 2;
    if (this._showslides) initialActiveSlides = this._showslides;

    let initialSlidesPerSlide = 1;
    if (this._slidesperclick) initialSlidesPerSlide = this._slidesperclick;

    let initialMargin = 0;
    if (this._slidesmargin) initialMargin = this._slidesmargin;

    let initialSlideWidth = 500;
    if (this._slidewidth) initialSlideWidth = this._slidewidth;

    // Кол-во слайдов в активном окне
    let activeSlides = initialActiveSlides;
    // Если по ошибке кол-во слайдов в активном окне указали менее или равным 0
    if (slidesPerSlide <= 0) slidesPerSlide = 1;
    // Если по ошибке кол-во слайдов в активном окне указали более чем всего слайдов в слайдере
    if (activeSlides > max) activeSlides = max;

    // Кол-во слайдов для пролистывания (если их более 1)
    let slidesPerSlide = initialSlidesPerSlide;
    // Если по ошибке кол-во слайдов для пролистывания указали менее или равным 0
    if (slidesPerSlide <= 0) slidesPerSlide = 1;
    // Если по ошибке кол-во слайдов для пролистывания указали более, чем кол-во слайдов в активном окне, приравнивает их
    if (slidesPerSlide > activeSlides) slidesPerSlide = activeSlides;
    // Если максимально кол-во слайдов не кратно кол-ву слайдов для пролистывания, приравнивает slidesPerSlide ближайшему кратному
    while ((max % slidesPerSlide) != 0) {
      slidesPerSlide--
    };

    // Текущая позиция слайдера в начале пролистывания
    let currentPos = 0;
    // Ширина слайда
    let slideWidth = initialSlideWidth;

    // Отступ между слайдами
    let margin = initialMargin

    // Полная ширина слайда с учетом margin
    let slideFullWidth = (slideWidth + margin * 2);

    // Меняем ширину контейнера в зависимости от ширины пролистывания. Полная ширина слайда * кол-во слайдов - отступы с 1-й стороны у крайних слайдов
    let LGCaruselSlider = slideFullWidth * activeSlides - margin * 2;
    this._LGCaruselSlider.style.width = LGCaruselSlider + 'px'

    // Меняем ширину слайда в разметке в зависимости от указанной.
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.margin = '0 ' + margin + 'px';
      slides[i].style.width = slideWidth + 'px';
      slides[i].style.minWidth = slideWidth + 'px';
    };

    // Клонируем слайды для иммитации бесконечного листания + убираем у них стандартный drag & drop
    for (let i = 1; i <= max; i++) {
      let copy = slides[slides.length - i].cloneNode(true);
      copy.ondragstart = function() {return false};
      this._LGCaruselSliderInner.prepend(copy);
    };
    for (let i = 0; i < max; i++) {
      let copy = slides[i].cloneNode(true);
      copy.ondragstart = function() {return false};
      this._LGCaruselSliderInner.append(copy);
    };

    // Дистанция пролистывания слайда
    let slideScroll = slideFullWidth * max;

    // Предварительно смещаем контейнер на 1 дистанцию пролистывания слайда - плюс margin с 1-й стороны
    this._LGCaruselSliderInner.style.transform = 'translateX(-' + (slideScroll + margin) + 'px)';

    // Переменная смещения границы контейнера
    let containerMargin = 0;

    // Адаптив
    let adaptCarusel = () => {

      if (document.body.clientWidth > 1170) {
        activeSlides = initialActiveSlides;
        if (activeSlides > max) activeSlides = max;
        slidesPerSlide = initialSlidesPerSlide;
        if (slidesPerSlide > activeSlides) slidesPerSlide = activeSlides;
        while ((max % slidesPerSlide) != 0) {
          slidesPerSlide--
        };

        margin = initialMargin;
        let parentPadding = parseInt(getComputedStyle(this._LGCarusel.parentNode).paddingLeft) * 2;
        slideWidth = this._LGCarusel.parentNode.clientWidth / activeSlides - initialMargin * 2 - parentPadding / activeSlides;
        if ((this._LGCarusel.parentNode.clientWidth / activeSlides - margin) > initialSlideWidth) slideWidth = initialSlideWidth;

        slideFullWidth = (slideWidth + margin * 2);

        LGCaruselSlider = slideFullWidth * activeSlides - margin * 2;

        slideScroll = slideFullWidth * max;
        currentPos = 0;
      };
      if (document.body.clientWidth > 768 && document.body.clientWidth < 1171) {
        activeSlides = initialActiveSlides;
        if (activeSlides > max) activeSlides = max;
        if (activeSlides > 4) activeSlides = 4;
        slidesPerSlide = initialSlidesPerSlide;
        if (slidesPerSlide > activeSlides) slidesPerSlide = activeSlides;
        while ((max % slidesPerSlide) != 0) {
          slidesPerSlide--
        };

        margin = initialMargin/1.68;
        let parentPadding = parseInt(getComputedStyle(this._LGCarusel.parentNode).paddingLeft) * 2;
        slideWidth = this._LGCarusel.parentNode.clientWidth / activeSlides - initialMargin - parentPadding / activeSlides;

        slideFullWidth = (slideWidth + margin * 2);

        LGCaruselSlider = slideFullWidth * activeSlides - margin * 2;

        slideScroll = slideFullWidth * max;
        currentPos = 0;
      };
      if (document.body.clientWidth > 450 && document.body.clientWidth < 769) {
        activeSlides = initialActiveSlides;
        if (activeSlides > max) activeSlides = max;
        if (activeSlides > 2) activeSlides = 2;
        if (slidesPerSlide > activeSlides) slidesPerSlide = activeSlides;
        while ((max % slidesPerSlide) != 0) {
          slidesPerSlide--
        };

        margin = initialMargin / 3;
        let parentPadding = parseInt(getComputedStyle(this._LGCarusel.parentNode).paddingLeft) * 2;
        slideWidth = (this._LGCarusel.parentNode.clientWidth - initialMargin) / activeSlides - parentPadding / activeSlides;

        slideFullWidth = (slideWidth + margin * 2);
        LGCaruselSlider = slideFullWidth * activeSlides - margin * 2;
        slideScroll = slideFullWidth * max;
        currentPos = 0;
      };
      if (document.body.clientWidth < 450) {
        activeSlides = 1;
        slidesPerSlide = 1;

        margin = initialMargin / 4;
        // if (margin < 10) margin = 10;
        let parentPadding = parseInt(getComputedStyle(this._LGCarusel.parentNode).paddingLeft) * 2;
        slideWidth = this._LGCarusel.parentNode.clientWidth - parentPadding / activeSlides;

        slideFullWidth = (slideWidth + margin * 2);
        LGCaruselSlider = slideFullWidth * activeSlides - margin * 2;
        slideScroll = slideFullWidth * max;
        currentPos = 0;
      };

      containerMargin = 0;

      this._LGCaruselSlider.style.width = LGCaruselSlider + 'px'

      let newslides = this._parent.querySelectorAll('.LGCarusel-Slide');
      for (let i = 0; i < newslides.length; i++) {
        newslides[i].style.margin = '0 ' + margin + 'px';
        newslides[i].style.width = slideWidth + 'px';
        newslides[i].style.minWidth = slideWidth + 'px';
      };

      this._LGCaruselSliderInner.style.transform = 'translateX(-' + (slideScroll + margin) + 'px)';
      this._LGCaruselSliderInner.style.marginLeft = containerMargin + 'px';
    };
    adaptCarusel();

    // Обаработчик на изменения окна браузера, для пересчета габаритов слайдера
    let onDocResize = () => {
      adaptCarusel();
    };

    // Для ПК ставим обработчик на изменеие окна браузера. Для тачскринов - на изменение ориентации, по той причине, что иногда свайпай пальцем может появиться строка браузера, которая все время то скрывается, то появляется в мобильных браузерах из-за чего текущий соайд сбрасывается до первого. Нивелируем это действие
    window.addEventListener('resize', onDocResize);
    if (document.body.clientWidth < 1025) {
      window.removeEventListener('resize', onDocResize);
      window.addEventListener('orientationchange', onDocResize);
    };

    // Обработчики кликов вперед/назад по кнопкам
    let nextSlide = () => {
      slideScroll += slideFullWidth * slidesPerSlide
      this._LGCaruselSliderInner.style.transform = 'translateX(' + (-slideScroll - margin) + 'px)';

      // Увеличиваем счетчик текущего слайда
      currentPos = currentPos + slidesPerSlide

      // Если продвигали сладйы на расстояние общего кол-ва слайдов - пора перемещать контейнер
      if (currentPos >= max) {
        // Сдвигаем контейнер на кол-во слайдов * ширину каждого
        containerMargin += slideFullWidth * slides.length;
        this._LGCaruselSliderInner.style.marginLeft = containerMargin + 'px';

        // Сбрасываем счетчик текущего слайда до первого слайда
        currentPos = 0;
      }

      // Анимация при прокрутке
        this._LGCaruselSliderInner.classList.add('LGCarusel-SliderInner_sliding')
        setTimeout(() => {
          this._LGCaruselSliderInner.classList.remove('LGCarusel-SliderInner_sliding')
        }, 500);
    };

    let prevSlide = () => {
      slideScroll -= slideFullWidth * slidesPerSlide
      this._LGCaruselSliderInner.style.transform = 'translateX(' + (-slideScroll - margin) + 'px)';

      // Уменьшаем счетчик текущего слайда
      currentPos = currentPos - slidesPerSlide;

      // Если продвигали сладйы на расстояние общего кол-ва слайдов - пора перемещать контейнер
      if (currentPos <= -max) {
        // Сдвигаем контейнер на кол-во слайдов * ширину каждого
        containerMargin -= slideFullWidth * slides.length;
        this._LGCaruselSliderInner.style.marginLeft = containerMargin + 'px';

        // Сбрасываем счетчик текущего слайда до последнего слайда
        currentPos = 0;
      }

      // Анимация при прокрутке
        this._LGCaruselSliderInner.classList.add('LGCarusel-SliderInner_sliding')
        setTimeout(() => {
          this._LGCaruselSliderInner.classList.remove('LGCarusel-SliderInner_sliding')
        }, 500);
    };

    // Анимация при клике по кнопкам вперед/назад
    let animateButton = (btn) => {
      if (this._options.nobtns) return;

      if (this._parent.dataset.lgnobtns == undefined) {
        btn.classList.add('LGCarusel-Button_clicked')
        setTimeout(function() {
          btn.classList.remove('LGCarusel-Button_clicked')
        }, 220)
      };
    };

    // Обработчик кликов по кнопке вперед
    this._LGCaruselButtonNext.onclick = (e) => {
      nextSlide();
      animateButton(this._LGCaruselButtonNext)
    };

    // Обработчик кликов по кнопке назад
    this._LGCaruselButtonPrev.onclick = (e) => {
      prevSlide();
      animateButton(this._LGCaruselButtonPrev)
    };

    // Autoplay
    // Переменные для очистки интервала автопереключения слайдеров и скокрости смены слайдов
    let autoPlayTimer, autoPlayInterval = null;
    if (this._autoplay) autoPlayInterval = this._autoplay;

    // Автопроигрывание для lgslider
    if (this._autoplay) {
      autoPlayTimer = setInterval(function() {
        nextSlide();
      },  autoPlayInterval ? autoPlayInterval : 3000);
    };

    // Обработчик прерывания автопроигрывания при наведении мышки на карусель
    this._LGCarusel.addEventListener('mouseenter', () => {
      clearInterval(autoPlayTimer)
    });

    this._LGCarusel.addEventListener('mouseleave', () => {
      if (this._autoplay) {
        autoPlayTimer = setInterval(function() {
          nextSlide();
        },  autoPlayInterval ? autoPlayInterval : 3000);
      };
    });

    // KEYBOARD
    // Обработчик переключения слайдов клавиатурой
    let changeSlideOnKeyboard = (e) => {
      // Сравниваем координаты нашей галереи с верхней и нижней границей видимой области экрана
      let visibleTop = this._parent.getBoundingClientRect().top >= -25;
      let visibleBottom = this._parent.getBoundingClientRect().bottom <= document.documentElement.clientHeight + 25;

      if (e.keyCode == 37) {
        // Проверка: если в видимой области - листаем
        if (visibleTop && visibleBottom) {
          prevSlide();
          animateButton(this._LGCaruselButtonPrev)
        };
        // Убираем стандартное поведение браузера при клике по кнопкам
        e.preventDefault();
      };
      if (e.keyCode == 39) {
        // Проверка: если в видимой области - листаем
        if (visibleTop && visibleBottom) {
          nextSlide();
          animateButton(this._LGCaruselButtonNext)
        }
        // Убираем стандартное поведение браузера при клике по кнопкам
        e.preventDefault();
      };
    };
    // Событие нажатия кнопки для lgcarusel
    document.addEventListener('keydown', changeSlideOnKeyboard);

    // SWIPE

    // Переменные для записи координат для свайпов
    let swipeStart = {}, swipeEnd = {};

    // Обработчики свайпов на ПК и тачскринах
    this._LGCarusel.addEventListener('mousedown', swipeStartOnDoc);
    this._LGCarusel.addEventListener('mouseup', swipeEndOnDoc);
    this._LGCarusel.addEventListener('touchstart', swipeStartOnMob);
    this._LGCarusel.addEventListener('touchend', swipeEndOnMob);

    // Функция переключения слайдов при свайпе
    let swipe = () => {
      if ((swipeEnd.x - swipeStart.x) < -100) {
        nextSlide();
      };
      if ((swipeEnd.x - swipeStart.x) > 100) {
        prevSlide();
      };
    };

    // ПК
    function swipeStartOnDoc(e) {
      swipeStart.x = e.clientX;
      swipeStart.y = e.clientY;
      e.preventDefault()
    };
    function swipeEndOnDoc(e) {
      swipeEnd.x = e.clientX;
      swipeEnd.y = e.clientY;

      swipe()
    };
    // Mobile
    function swipeStartOnMob(e) {
      swipeStart.x = e.changedTouches[0].pageX;
      swipeStart.y = e.changedTouches[0].pageY;
    };
    function swipeEndOnMob(e) {
      swipeEnd.x = e.changedTouches[0].pageX;
      swipeEnd.y = e.changedTouches[0].pageY;

      swipe()
    };
  };

  // ------------ Стандартные объекты опций --------------

  LGallery.prototype._lgalleryoption = {};
  LGallery.prototype._lgparentoption = {};
  LGallery.prototype._lgslideroption = {};
  LGallery.prototype._lgpreviewoption = {};
  LGallery.prototype._lgcaruseloption = {};

  // ------------ Методы для вызова во внешнем коде --------------

  // Установка объекта опций глобально для всех галерей
  window.setLG = function(type, option) {
    if (type == 'lgallery') LGallery.prototype._lgalleryoption = option;
    if (type == 'lgparent') LGallery.prototype._lgparentoption = option;
    if (type == 'lgslider') LGallery.prototype._lgslideroption = option;
    if (type == 'lgpreview') LGallery.prototype._lgpreviewoption = option;
    if (type == 'lgcarusel') LGallery.prototype._lgcaruseloption = option;
  };

  // Создание одиночной галереи с возможностью задать свой объект опций при необходимости
  window.createLG = function(elem, options) {
    // Создаем новый объект и создаем ему свойство parent со значением elem
    let opt = {};
    opt.parent = elem;

    // // Копируем остальные свойства (если они есть) из стандартного объекта опций
    // for (let key in LGallery.prototype._option) {
    //   opt[key] = LGallery.prototype._option[key]
    // };

    // Если в качестве аргумента передан объект опций, копируем свойства и из него
    if (options) {
      for (let key in options) {
        opt[key] = options[key]
      };
    };

    // Доп. проверка на наличие галлерей
    let check = elem.querySelectorAll('.LGallery');
    if (check.length) return

    // Создаем и возвращаем (чтобы можно было с ним работать при необходимости) новый объект галереи
    return new LGallery(opt)
  };

  // Поиск по всему документу элементов с data-lgallery и data-lgparent и создание в них галереи
  window.initLG = function() {
    // Создаем пустой масив для записи галерей
    let arr = [];

    // Ищем в документе все элементы с data-lgallery
    let all = document.querySelectorAll('[data-lgallery]');

    // Создаем с каждым из них новый объект галереи со стандартным объктом опций. Каждый из них записываем в созданый ранее массив
    for (let i = 0; i < all.length; i++) {
      LGallery.prototype._lgalleryoption.parent = all[i];

      // Доп. проверка на наличие галлерей
      let check = all[i].querySelectorAll('.LGallery');
      if (check.length) return

      let gal = new LGallery(LGallery.prototype._lgalleryoption);
      arr.push(gal)
    };

    // Аналогично но с data-lgparent
    let allParent = document.querySelectorAll('[data-lgparent]');

    for (let i = 0; i < allParent.length; i++) {
      LGallery.prototype._lgparentoption.parent = allParent[i];

      // Доп. проверка на наличие галлерей
      let check = allParent[i].querySelectorAll('.LGallery');
      if (check.length) return

      let gal = new LGallery(LGallery.prototype._lgparentoption);
      arr.push(gal)
    };

    // Аналогично но с data-lgslider
    let allSlider = document.querySelectorAll('[data-lgslider]');

    for (let i = 0; i < allSlider.length; i++) {
      LGallery.prototype._lgslideroption.parent = allSlider[i];

      // Доп. проверка на наличие галлерей
      let check = allSlider[i].querySelectorAll('.LGallerySlider');
      if (check.length) return

      let gal = new LGallery(LGallery.prototype._lgslideroption);
      arr.push(gal)
    };

    // Аналогично но с data-lgpreview
    let allPreview = document.querySelectorAll('[data-lgpreview]');

    for (let i = 0; i < allPreview.length; i++) {
      LGallery.prototype._lgpreviewoption.parent = allPreview[i];

      // Доп. проверка на наличие галлерей
      let check = allPreview[i].querySelectorAll('.LGallerySlider');
      if (check.length) return

      let gal = new LGallery(LGallery.prototype._lgpreviewoption);
      arr.push(gal)
    };

    // Аналогично но с data-lgcarusel
    let allCarusel = document.querySelectorAll('[data-lgcarusel]');

    for (let i = 0; i < allCarusel.length; i++) {
      LGallery.prototype._lgcaruseloption.parent = allCarusel[i];

      // Доп. проверка на наличие галлерей
      let check = allCarusel[i].querySelectorAll('.LGallery');
      if (check.length) return

      let gal = new LGallery(LGallery.prototype._lgcaruseloption);
      arr.push(gal)
    };

    // Возвращаем масив для работы с ним
    return arr
  };

}());




















//
