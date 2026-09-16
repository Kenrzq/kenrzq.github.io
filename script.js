(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- background video: pause it if reduced motion is preferred ----
  var bgVideo = document.getElementById('bg-video');
  if(bgVideo){
    if(reduceMotion){
      bgVideo.pause();
      bgVideo.removeAttribute('autoplay');
    } else {
      bgVideo.play().catch(function(){ /* autoplay may be blocked until user interacts */ });
    }
  }

  // ---- soul meter fill on scroll ----
  var fill = document.getElementById('soul-fill');
  function updateSoul(){
    var doc = document.documentElement;
    var scrollTop = doc.scrollTop || document.body.scrollTop;
    var scrollH = doc.scrollHeight - doc.clientHeight;
    var pct = scrollH > 0 ? Math.min(100, (scrollTop/scrollH)*100) : 0;
    if(fill) fill.style.height = pct+'%';
  }
  document.addEventListener('scroll', updateSoul, {passive:true});
  updateSoul();

  // ---- reveal on scroll ----
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.15});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-visible'); });
  }

  // ---- stat bars fill once visible ----
  var statsBlock = document.getElementById('stats-block');
  if(statsBlock && 'IntersectionObserver' in window){
    var statIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          document.querySelectorAll('.stat-row').forEach(function(row){
            var val = row.getAttribute('data-value');
            var barFill = row.querySelector('.stat-fill');
            if(barFill) barFill.style.width = val+'%';
          });
          statIO.unobserve(entry.target);
        }
      });
    }, {threshold:0.3});
    statIO.observe(statsBlock);
  }
})();