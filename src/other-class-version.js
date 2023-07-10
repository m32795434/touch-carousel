class Slider {
  constructor(slider) {
    if (!slider || !(slider instanceof Element)) {
      throw new Error('Slider not found or not an Element');
    }
    
    this.slider = slider;
    this.slides = this.slider.querySelector('.slides');
    this.play = this.slider.querySelector('.play');
    const prevButton = this.slider.querySelector('.goToPrev');
    const nextButton = this.slider.querySelector('.goToNext');
    this.current = this.slider.querySelector('.current') || this.slides.firstElementChild;
    this.next = this.current.nextElementSibling || this.slides.firstElementChild;
    this.prev = this.current.previousElementSibling || this.slides.lastElementChild;

    // Bindings
    this.move = this.move.bind(this);
    this.playPauseFunction = this.playPauseFunction.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    prevButton.addEventListener('click', () => this.move('back'));
    nextButton.addEventListener('click', this.move);
    this.play.addEventListener('click', this.playPauseFunction);

    // Event listeners for touch events
    this.slider.addEventListener('touchstart', this.handleTouchStart);
    this.slider.addEventListener('touchmove', this.handleTouchMove);
    this.slider.addEventListener('touchend', this.handleTouchEnd);

    // Event listeners for mouse events
    this.slider.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);

    this.applyClasses();
  }

  applyClasses() {
    this.current.classList.add('current');
    this.prev.classList.add('prev');
    this.next.classList.add('next');
  }

  move(direction = '') {
    const classesToRemove = ['current', 'prev', 'next'];
    [this.current, this.prev, this.next].forEach((el) => {
      el.classList.remove(...classesToRemove);
    });
    if (direction === 'back') {
      [this.prev, this.current, this.next] = [
        this.prev.previousElementSibling || this.slides.lastElementChild,
        this.prev,
        this.current,
      ];
    } else {
      [this.prev, this.current, this.next] = [
        this.current,
        this.next,
        this.next.nextElementSibling || this.slides.firstElementChild,
      ];
    }
    this.applyClasses();
  }

  playPauseFunction(e) {
    const t = e.target;
    t.classList.toggle('open');
    if (e.target.matches('.open')) {
      t.innerHTML = '&#9612;&#9612;';
      this.running = setInterval(() => {
        this.move();
      }, 2000);
    } else {
      t.innerHTML = '&#x25B6;';
      clearInterval(this.running);
    }
  }

  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
    this.touchEndX = this.touchStartX;
  }

  handleTouchMove(e) {
    e.preventDefault();
    this.touchEndX = e.touches[0].clientX;
  }

  handleTouchEnd() {
    const distance = this.touchEndX - this.touchStartX;
    if (distance > 0) {
      this.move('back');
    } else if (distance < 0) {
      this.move();
    }
  }
  handleMouseDown(e) {
    this.isDragging = true;
    this.dragStartX = e.clientX;
    this.dragEndX = this.dragStartX;
  }

  handleMouseMove(e) {
    if (!this.isDragging) {
      return;
    }

    this.dragEndX = e.clientX;
  }

  handleMouseUp() {
    if (!this.isDragging) {
      return;
    }

    const distance = this.dragEndX - this.dragStartX;
    if (distance > 0) {
      this.move('back');
    } else if (distance < 0) {
      this.move();
    }

    this.isDragging = false;
  }
}

const mySlider = new Slider(document.querySelector('.slider'));
const dogSlider = new Slider(document.querySelector('.dog-slider'));
