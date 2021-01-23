var defaults = {
    pagination: '.swiper-pagination',
    slidesPerView: 3,
    freeMode: true,
    freeModeSticky: true,
    freeModeMomentumRatio: 0.25,
    freeModeVelocityRatio: 0.25,
    freeModeMinimumVelocity: 0.1,
    loop: true,
    loopAdditionalSlides: 5,
    direction: 'vertical',
    slideToClickedSlide: true,
    centeredSlides: true,
    onSlideChangeEnd: updateInput
  };
  
  var hours = Swiper(
    '.swiper-container.hours',
    Object.assign({}, defaults, {
      initialSlide: 13
    })
  );
  hours.on('slideChangeEnd', function () {
    
  })
  
  var minutes = Swiper(
    '.swiper-container.minutes',
    Object.assign({}, defaults, {
      initialSlide: 37
    })
  );
  
  var seconds = Swiper('.swiper-container.seconds', defaults);
  
  var input = document.getElementById('input');
  input.addEventListener('focus', moveLeft);
  
  input.addEventListener('click', function (evt) {
    var start = input.selectionStart;
    var mod = start % 3;
    start -=  mod;
    input.setSelectionRange(start, start + 2);
  });
  
  input.addEventListener('keydown', function(evt) {
    evt.preventDefault();
    switch (evt.keyCode) {
      case 38:
        change(true);
        break;
      case 40:
        change();
        break;
      case 37:
        moveLeft();
        break;
      case 39:
        moveRight();
        break;
    }
  });
  
  function moveLeft(e) {
    var start = input.selectionStart;
    var end = input.selectionEnd;
    
    var invalidSelection = (end - start !== 2) || (start % 3 !== 0);
    
    if (invalidSelection) {
      input.setSelectionRange(0, 2);
    } else if (start > 0) {
      start -= 3;
      input.setSelectionRange(start, start+2);
    }
  }
  
  function moveRight() {
    var start = input.selectionStart;
    var end = input.selectionEnd;
    
    if (end - start !== 2) {
      input.setSelectionRange(0, 2);
    }
    
    if (end < input.value.length) {
      start += 3;
    }
    
    input.setSelectionRange(start, start+2);
  }
  
  function findPart() {
    var start = input.selectionStart;
    var mod = start % 3;
    start -=  mod;
    
    if (start === 6) {
      return seconds;
    } else if (start === 3) {
      return minutes;
    }
    
    return hours;
  }
  
  function change(direction) {
    var part = findPart();
    direction? part.slideNext(true, 50) : part.slidePrev(true, 50);
  }
  
  function updateInput() {
    if (!input) {
      return false;
    }
    
    var start = input.selectionStart;
    var end = input.selectionEnd;
    input.value = pad(hours.realIndex) + ':' + pad(minutes.realIndex) + ':' + pad(seconds.realIndex);
    input.setSelectionRange(start, end);
  }
  
  function pad(v) {
    return v > 9? v : "0" + String(v);
  }
  
  input.focus();