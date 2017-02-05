// let Hammer = require('../node_modules/hammerjs/hammer.min.js');
import Hammer from '../node_modules/hammerjs/hammer.js';

export default class Deslider {
  constructor(imgSources, container, options){
    this.sliderPanelSelector = '.deslider-panel';
    this.sliderPaginationSelector = '.deslider-pagination';
    
    this.activeSlide = 0;
    this.timeoutHandle = undefined;

    this.container = document.querySelector(container);

    // create options object
    options = options || {}; // if options object not passed in, then set to empty object 
    options.auto = options.auto || true; // if options.auto object not passed in, then set to false
    this.options = {
      auto: (typeof options.auto === 'undefined') ? false : options.auto, // auto-move the slides
      speed: (typeof options.auto.speed === 'undefined') ? 3000 : options.auto.speed, // speed for auto-changing slides (ms)
      pauseOnHover: (typeof options.auto.pauseOnHover === 'undefined') ? true : options.auto.pauseOnHover, // when mouse is over images, 
                                                                                                  // auto-changing stops by default
      fullScreen: (typeof options.fullScreen === 'undefined') ? true : options.fullScreen, // enable fullScreen options
      swipe: (typeof options.swipe === 'undefined') ? true : options.swipe, // enable swipe with fingers/mouse drag
      pagination: (typeof options.pagination === 'undefined') ? true : options.pagination,
      repeat: (typeof options.repeat === 'undefined') ? true: options.repeat
    };

    // create the deslider element to contain images and controls
    this.sliderEl = document.createElement('div');
    this.sliderEl.className = 'deslider';
    this.container.appendChild(this.sliderEl);

    // add the images
    imgSources = imgSources || [];
    imgSources.map((img) => {
      let child = document.createElement("figure");
      child.className = "deslider-panel";
      child.innerHTML = '<img src="' + img.link + '" />';
      child.innerHTML = child.innerHTML + '<figcaption>' + img.caption + '</figcaption>';
      this.sliderEl.appendChild(child);
    });
    this.slideCount = imgSources.length || 0;
    this.sliderEl.style.width = (this.slideCount * 100) + "%";

    this.allFigures = this.sliderEl.parentElement.querySelectorAll('figure');
    for (let i = 0; i < this.slideCount; ++i){
      this.allFigures[i].style.maxWidth = (100/this.slideCount) + '%';  
    }

    // create the pagination
    if (this.options.pagination === true){
      this.createPagination();
    }
    
    // create the full screen control
    if (this.options.fullScreen === true){
      this.addFullScreen(this.container);        
    }

    // create the autoCycle control
    if (this.options.auto === true){
      this.autoCycle(this.options.speed, this.options.pauseOnHover);
    }
       
    // add next/prev buttons
    this.injectControls(this.container);
    // create next/prev listeners
    this.createEventListeners(this.container);

    // create swipe controls
    if (this.options.swipe === true){
      this.addSwipe();
    }
  }

  createEventListeners(){
    this.container.querySelector('.deslider-next').addEventListener('click', () => {
      this.goToSlide(this.activeSlide + 1);
    }, false);

    this.container.querySelector('.deslider-prev').addEventListener('click', () => {
      this.goToSlide(this.activeSlide - 1);
    }, false);

    this.container.onkeydown = (e) => {
      e = e || window.event;
      if (e.keyCode === 37){
        this.goToSlide(this.activeSlide - 1); // increment & show
      } else if (e.keyCode === 39){
        this.goToSlide(this.activeSlide + 1); // decrement & show
      }
    };
  }

  injectControls(){
    // build and inject prev/next controls
    // first create all the new elemnts
    let spanPrev = document.createElement("span"),
        spanNext = document.createElement("span"),
        docFrag = document.createDocumentFragment();

    // add classes
    spanPrev.classList.add('deslider-prev');
    spanNext.classList.add('deslider-next');

    // add contents
    spanPrev.innerHTML = '&laquo;';
    spanNext.innerHTML = '&raquo;';

    // append elements to fragment, then append fragment to DOM
    docFrag.appendChild(spanPrev);
    docFrag.appendChild(spanNext);
    this.container.appendChild(docFrag);
  }

  goToSlide(number){
    console.log('goToSlide ', number);
    if (this.options.repeat === true){
      if (number < 0){
        this.activeSlide = this.slideCount - 1;
      } else if (number > this.slideCount - 1){
        this.activeSlide = 0;
      } else {
        this.activeSlide = number;
      }
    } else {
      if (number < 0){
        this.activeSlide = 0;
      } else if (number > this.slideCount - 1){
        this.activeSlide = this.slideCount - 1;
      } else {
        this.activeSlide = number;
      }
    }

    this.sliderEl.classList.add('is-animating');
    let percentage = -(100/this.slideCount) * this.activeSlide;
    this.sliderEl.style.transform = 'translateX(' + percentage + '%)';
    clearTimeout(this.timeoutHandle);
    this.timeoutHandle = setTimeout(() => {
      this.sliderEl.classList.remove('is-animating');
    }, 400);

    if (this.options.pagination === true){
      this.updatePagination();  
    }
  }

  addSwipe(){
    this.sliderManager = new Hammer.Manager(this.sliderEl);
    this.sensitivity = 25;
    this.sliderManager.add(new Hammer.Pan({threshold: 0, pointers: 0}));
    this.sliderManager.on('pan', (e) => {
      let percentage = (e.deltaX / (this.slideCount * window.innerWidth)) * 100;
      //console.log(percentage);
      let transformPercentage = percentage - this.activeSlide / this.slideCount * 100;
      //console.log(transformPercentage);

      this.sliderEl.style.transform = 'translateX(' + transformPercentage + '%)';

      //console.log(e);
      if (e.isFinal){
        if (e.velocityX > 1){
          console.log('e.velocityX > 1');
          this.goToSlide(this.activeSlide - 1);
        } else if (e.velocityX < -1){
          console.log('e.velocityX < -1');
          this.goToSlide(this.activeSlide + 1);
        } else {
          if( percentage <= -( this.sensitivity / this.slideCount ) ){
            console.log('percentage <= -( this.sensitivity / this.slideCount )');
            this.goToSlide( this.activeSlide + 1 );
          }
          else if( percentage >= ( this.sensitivity / this.slideCount ) ){
            console.log('percentage >= ( this.sensitivity / this.slideCount )');
            this.goToSlide( this.activeSlide - 1 );
          }
          else{
            console.log('else');
            this.goToSlide( this.activeSlide );
          }
        }
      }
    });
  }

  createPagination(){
    this.sliderPagination = document.createElement('div');
    this.sliderPagination.className = 'deslider-pagination';
    this.container.appendChild(this.sliderPagination); 
    for (let i = 0; i < this.slideCount; ++i){
      let activeStatus = i == this.activeSlide ? ' class="is-active"' : 'class="fuck"';
      this.sliderEl.parentElement.querySelector(this.sliderPaginationSelector).innerHTML
           += '<div ' + activeStatus + '></div>';
    } 
  }

  updatePagination(){
    let pagination = this.sliderEl.parentElement.querySelectorAll(this.sliderPaginationSelector + ' > *');
    for (let i = 0; i < pagination.length; ++i){
      let className = i == this.activeSlide ? 'is-active' : 'fuck';
      pagination[i].className = className;
    }
  }

  addFullScreen(container){
    let fsControl = document.createElement("span");
    fsControl.classList.add('deslider-fullscreen');
    container.appendChild(fsControl);
    container.querySelector('.deslider-fullscreen').addEventListener('click', () => {
      this.toggleFullScreen(container);
    }, false);
  }

  toggleFullScreen(el){
    // https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement &&   
        !document.msFullscreenElement ) {  // current working methods
        if (document.documentElement.requestFullscreen) {
          el.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
          el.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          el.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          el.webkitRequestFullscreen(el.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
    }
  } // end toggleFullScreen

  autoCycle(speed, pauseOnHover){
    this.interval = window.setInterval(() => {
          this.goToSlide(this.activeSlide + 1); // increment & show
        }, speed);

    if (pauseOnHover){
      this.container.addEventListener('mouseover', () => {
        this.interval = clearInterval(this.interval);
      }, false);
      this.container.addEventListener('mouseout', () => {
        this.interval = window.setInterval(() => {
          this.goToSlide(this.activeSlide + 1); // increment & show
        }, speed);
      }, false);
    } // end pauseonhover
  }

  stop(){
    this.interval = clearInterval(this.interval);
  }
};

