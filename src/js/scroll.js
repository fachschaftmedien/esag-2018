const isBetween = (value,low,high) => value < high && value >= low;

export default class Scroll{

  constructor(elements, options){
    this.options = {
      addCssClass: true,
      onViewClass: "on-view",
      offViewClass: "off-view",
      allowKeyControl: true,
      preventKeyDefaults: true,
      nextKeys: [39,68,34],
      prevKeys: [37,65,33],
      downKeys: [83],
      upKeys: [87],
      verbose: false
    };
    if(arguments.length > 1){
      this.elements = Array.from(arguments).reduce((all, current) => all.concat(current),[]);
      const last = this.elements[this.elements.length-1];
      if(last instanceof Object){
        this.options = Object.assign(this.options, last);
        this.elements = this.elements.slice(0, this.elements.length - 1);
      }
    }else if(arguments.length === 1 && arguments[0] instanceof Array){
      this.elements = arguments[0];
    }else if(arguments.length === 1 && !(arguments[0] instanceof Object)){
      this.elements = [arguments[0]];
    }else{
      throw new Error("Invalid argument to constructor of Scroll: expected at least one parameter of type array or any");
    }
    if(this.options.verbose) console.log('initialize scroll with',this.elements, this.options);
    window.history.scrollRestoration = 'manual';
    window.addEventListener('resize',this._setCurrentIndex);
    window.addEventListener('load', this._scrollToHash.bind(this));
    this._handleScroll(null);
    document.addEventListener('scroll', this._handleScroll);
    if(this.options.allowKeyControl){
      document.addEventListener('keydown', this._handleKeys);
    }
    this._handlers = {};
    this.paused = false;
  }

  static scrollTop(){
    return window.pageYOffset || document.documentElement.scrollTop || document.scrollingElement.scrollTop || document.body.scrollTop || 0;
  }

  static scrollBottom(){
    return this.scrollTop()+window.innerHeight;
  }

  on(event, func){
    this._handlers[event] = this._handlers[event] ? this._handlers.concat(func) : [func];
  }

  off(event, func){
    if(this._handlers[event] instanceof Array){
      this._handlers[event] = this._handlers[event].filter(handler => handler.toString() !== func.toString());
    }
  }

  pauseScrollTo(bool=true){
    this.paused = bool;
  }

  _invokeHandlers = (event, args) => {
    if(!this._handlers) return;
    if(this._handlers[event] && this._handlers[event] instanceof Array){
      this._handlers[event].forEach(handler => handler.apply(null, args));
    }else{
      if(this.options.verbose) console.log('Tried to invoke event handler '+event+', but no hanlder functions are registered');
    }
  };

  _isInViewPort(el){
    if(!el) return false;
    const elTop = el.offsetTop;
    const elBottom = elTop + el.clientHeight;
    return isBetween(elTop, Scroll.scrollTop(), Scroll.scrollBottom()) ||
           isBetween(elBottom, Scroll.scrollTop(),Scroll.scrollBottom());
  }

  _setCurrentIndex = () => {
    const yCenter = ~~Scroll.scrollTop() + ~~((Scroll.scrollBottom() - Scroll.scrollTop())/2);
    const index = this.elements.findIndex(function(el){
      const elTop = el.offsetTop;
      const elBottom = elTop + el.clientHeight;
      return isBetween(yCenter,elTop,elBottom);
    }, 0);
    if(this.options.verbose) console.log('set index='+index);
    if(this.currentIndex !== index) this._invokeHandlers('changeSection',[index,this.currentIndex]);
    if(this.currentIndex < index) this._invokeHandlers('nextSection',[index, Scroll.scrollTop()]);
    if(this.currentIndex > index) this._invokeHandlers('prevSection',[index, Scroll.scrollTop()]);
    this.currentIndex = index;
  };

  _scrollToHash(){
    let hash = window.location.hash;
    if(hash){
      hash = hash.replace('#','');
      const elem = document.getElementById(hash);
      const index = this.elements.findIndex(el => el === elem);
      if(index >= 0) this.to(index);
    }
  }

  scrollTo(px=0){
    if(this.options.verbose) console.log("scrolling to "+px);
    if(!this.paused) document.documentElement.scrollTop = px;
  }

  scrollToPageTop(){
    this.scrollTo(0);
  }

  scrollToPageBottom(){
    this.scrollTo(document.documentElement.offsetHeight);
  }

  to(n){
    if(this.options.verbose) console.log('go to section n=',n,' index=',this.currentIndex);
    if(n >= 0 && n < this.elements.length){
      this.currentIndex = n;
      const currentElem = this.elements[this.currentIndex]
      this.scrollTo(currentElem.offsetTop);
      this.__updateHash(currentElem);
      return true;
    }
    return false;
  }

  __updateHash(elem){
    if(elem.id) window.location.hash = elem.id;
  }

  first(){
    this.to(0);
    if(this.options.verbose) console.log('scroll to first');
  }

  last(){
    this.to(this.elements.length - 1);
    if(this.options.verbose) console.log('scroll to last');
  }

  next(n=1){
    this.currentIndex += n;
    const currentElem = this.elements[this.currentIndex]
    this.scrollTo(currentElem.offsetTop);
    this.__updateHash(currentElem);
    if(this.options.verbose) console.log('next n='+n,'index='+this.currentIndex);
  }

  hasNext(n=1){
    if(this.options.verbose) console.log('hasNext n='+n+' index='+this.currentIndex);
    return this.currentIndex+n <= this.elements.length - 1;
  }

  prev(n=1){
    this.currentIndex -= n;
    const currentElem = this.elements[this.currentIndex];
    this.scrollTo(currentElem.offsetTop);
    this.__updateHash(currentElem);
    if(this.options.verbose) console.log('prev n='+n+' index='+this.currentIndex);
  }

  hasPrev(n=1){
    if(this.options.verbose) console.log('hasPrev n='+n+' index=',this.currentIndex);
    return this.currentIndex-n >= 0;
  }

  _handleScroll = (e) => {
    this._invokeHandlers('scroll',[e,Scroll.scrollTop]);
    if(this.options.verbose) console.log('scrolled to',~~Scroll.scrollTop(),'-',~~Scroll.scrollBottom());
    this._setCurrentIndex();
    this.elements.forEach(el => {
      if(this._isInViewPort(el)){
        el.classList.add(this.options.onViewClass);
        el.classList.remove(this.options.offViewClass);
      }else{
        el.classList.add(this.options.offViewClass);
        el.classList.remove(this.options.onViewClass);
      }
    });
  };

  _handleKeys = (e) => {
    if(this.paused) return e;
    if(this.options.verbose) console.log('caught keypress',e);
    this._invokeHandlers('key',[e]);
    if(this.options.upKeys.concat(this.options.downKeys).concat(this.options.nextKeys).concat(this.options.prevKeys).indexOf(e.keyCode) >= 0){
      e.preventDefault();
    }
    if(this.options.upKeys.indexOf(e.keyCode) >= 0){
      if(this.options.verbose) console.log('up key',e.keyCode);
      this._invokeHandlers('upKey',[e,Scroll.scrollTop()]);
      this.scrollTo(Math.max(Scroll.scrollTop() - 5, 0));
    }else if(this.options.downKeys.indexOf(e.keyCode) >= 0){
      this._invokeHandlers('downKey',[e,Scroll.scrollBottom()]);
      if(this.options.verbose) console.log('down key',e.keyCode);
      this.scrollTo(Math.min(Scroll.scrollTop() + 5, document.documentElement.offsetHeight - window.innerHeight));
    }else if(this.options.prevKeys.indexOf(e.keyCode) >= 0){
      this._invokeHandlers('prevKey',[e,this.currentIndex]);
      if(this.options.verbose) console.log('prev key',e.keyCode);
      if(this.hasPrev()) this.prev();
    }else if(this.options.nextKeys.indexOf(e.keyCode) >= 0){
      this._invokeHandlers('nextKey',[e,this.currentIndex]);
      if(this.options.verbose) console.log('next key',e.keyCode);
      if(this.hasNext()) this.next();
    }
  };

  clear(){
    if(this.options.verbose) console.log('clear scroll');
    this.elements = [];
    this._handlers = {};
    document.removeEventListener('scroll', this._handleScroll);
  }
};
