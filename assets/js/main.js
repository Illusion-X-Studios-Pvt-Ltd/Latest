/* ==============================================
   ILLUSIONXSTUDIOS — MAIN.JS v3
   No globe, flat nav, cinematic reveals, varied text anims
   ============================================== */
(function(){
'use strict';

/* ── CURSOR ── */
function initCursor(){
  var cur=document.getElementById('cur'),cur2=document.getElementById('cur2');
  if(!cur)return;
  if('ontouchstart' in window){cur.style.display='none';if(cur2)cur2.style.display='none';return}
  var mx=window.innerWidth/2,my=window.innerHeight/2;
  document.addEventListener('mousemove',function(e){
    mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';
    var ratio=window.scrollY/(document.body.scrollHeight-window.innerHeight||1);
    cur.style.borderColor=ratio<.33?'#00D4FF':ratio<.66?'#0080FF':'#8B00FF';
  });
  setInterval(function(){if(cur2){cur2.style.left=mx+'px';cur2.style.top=my+'px'}},60);
  document.querySelectorAll('a,button,.sc,.bc,.wc,.port-card,.hscroll-card,.sub-card,.ci,.soc').forEach(function(el){
    el.addEventListener('mouseenter',function(){cur.classList.add('big')});
    el.addEventListener('mouseleave',function(){cur.classList.remove('big')});
  });
}

/* ── HERO CAROUSEL ── */
function initHeroCarousel(){
  var slides=document.querySelectorAll('.hero-slide'),dots=document.querySelectorAll('.hero-dot');
  if(slides.length<2)return;
  var current=0,total=slides.length,timer;
  function goTo(i){slides[current].classList.remove('active');dots[current].classList.remove('active');current=i%total;slides[current].classList.add('active');dots[current].classList.add('active')}
  function next(){goTo(current+1)}
  function start(){clearInterval(timer);timer=setInterval(next,5000)}
  dots.forEach(function(d,i){d.addEventListener('click',function(){goTo(i);start()})});
  start();
  var hero=document.getElementById('hero');
  if(hero){hero.addEventListener('mouseenter',function(){clearInterval(timer)});hero.addEventListener('mouseleave',start)}
}

/* ── HERO GRID ── */
function initGrid(sid,gid){
  var sec=document.getElementById(sid),grid=document.getElementById(gid);
  if(!sec||!grid)return;var last=0;
  sec.addEventListener('mousemove',function(e){
    var r=sec.getBoundingClientRect();
    grid.style.setProperty('--mx',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
    grid.style.setProperty('--my',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
    var now=Date.now();if(now-last<280)return;last=now;
    var rip=document.createElement('div');rip.className='ripple';
    rip.style.left=(e.clientX-r.left)+'px';rip.style.top=(e.clientY-r.top)+'px';
    sec.appendChild(rip);setTimeout(function(){rip.remove()},1000);
  });
  sec.addEventListener('mouseleave',function(){grid.style.setProperty('--mx','50%');grid.style.setProperty('--my','50%')});
}

/* ── CTA GRID ── */
function initCtaGrid(){
  var sec=document.getElementById('cta-final'),grid=document.getElementById('cta-grid');
  if(!sec||!grid)return;
  sec.addEventListener('mousemove',function(e){
    var r=sec.getBoundingClientRect();
    grid.style.setProperty('--mx',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
    grid.style.setProperty('--my',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
  });
}

/* ── CARD SPOTLIGHT ── */
function initCardSpotlight(){
  document.querySelectorAll('.sc,.bc').forEach(function(card){
    card.addEventListener('mousemove',function(e){
      var r=card.getBoundingClientRect();
      card.style.setProperty('--sx',(e.clientX-r.left)+'px');
      card.style.setProperty('--sy',(e.clientY-r.top)+'px');
      card.style.setProperty('--gx',(e.clientX-r.left)+'px');
      card.style.setProperty('--gy',(e.clientY-r.top)+'px');
    });
  });
}

/* ── BENTO ── */
function initBento(){
  document.querySelectorAll('.bc').forEach(function(card){
    card.addEventListener('click',function(){card.classList.toggle('open')});
  });
}

/* ── SCROLL REVEAL (legacy .reveal) ── */
function initReveal(){
  document.body.classList.add('js-on');
  var els=document.querySelectorAll('.reveal');if(!els.length)return;
  var lastScrollY=window.scrollY;
  var obs=new IntersectionObserver(function(entries){
    var down=window.scrollY>=lastScrollY;
    entries.forEach(function(e){
      if(e.isIntersecting){e.target.classList.remove('out-up');e.target.classList.add('in')}
      else if(!down){e.target.classList.remove('in');e.target.classList.add('out-up');setTimeout(function(){e.target.classList.remove('out-up')},600)}
    });
    lastScrollY=window.scrollY;
  },{threshold:0.1,rootMargin:'0px 0px -60px 0px'});
  window.addEventListener('scroll',function(){lastScrollY=window.scrollY},{passive:true});
  els.forEach(function(el){obs.observe(el)});
}

/* ── STAT COUNTERS ── */
function initCounters(){
  var els=document.querySelectorAll('[data-count]');if(!els.length)return;
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting)return;var el=e.target;
      var target=parseInt(el.dataset.count,10),suf=el.dataset.suffix||'',current=0,step=target/55;
      var timer=setInterval(function(){current=Math.min(current+step,target);el.textContent=Math.floor(current)+suf;if(current>=target)clearInterval(timer)},18);
      obs.unobserve(el);
    });
  },{threshold:0.5});
  els.forEach(function(el){obs.observe(el)});
}

/* ── NAVBAR ── */
function initNav(){
  var nav=document.getElementById('nav');if(!nav)return;
  var lastY=0,ticking=false;
  function update(){
    var y=window.scrollY;
    if(y>lastY&&y>80)nav.classList.add('hidden');
    else nav.classList.remove('hidden');
    lastY=y;ticking=false;
  }
  window.addEventListener('scroll',function(){if(!ticking){requestAnimationFrame(update);ticking=true}},{passive:true});
  var cue=document.querySelector('.scroll-cue');
  if(cue){window.addEventListener('scroll',function(){if(window.scrollY>80)cue.classList.add('gone')},{passive:true})}
}

/* ============================================
   GSAP: HORIZONTAL SCROLL + CINEMATIC REVEALS
   ============================================ */
function initHorizontalScroll(){
  if(!window.gsap||!window.ScrollTrigger)return;
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('.hscroll-section').forEach(function(section){
    var track=section.querySelector('.hscroll-track');if(!track)return;
    var masks=track.querySelectorAll('.img-reveal-mask');
    var cards=track.querySelectorAll('.hscroll-card, .port-card, .port-card-cta');

    var getScrollAmount=function(){return -(track.scrollWidth-window.innerWidth)};

    var hTween=gsap.to(track,{
      x:getScrollAmount,ease:'none',
      scrollTrigger:{
        trigger:section,start:'top top',
        end:function(){return '+='+(track.scrollWidth-window.innerWidth)},
        pin:true,scrub:1,invalidateOnRefresh:true,anticipatePin:1
      }
    });

    // Cinematic mask reveal — mask slides LEFT, image counter-translates
    masks.forEach(function(mask){
      var imgWrap=mask.closest('.hscroll-img-wrap, .port-card-img');
      var img=imgWrap?imgWrap.querySelector('img'):null;
      var card=mask.closest('.hscroll-card, .port-card');
      gsap.set(mask,{x:'0%'});
      if(img) gsap.set(img,{x:'18%',scale:1.15,filter:'brightness(0.4) blur(3px)'});
      gsap.to(mask,{x:'-101%',ease:'power3.inOut',scrollTrigger:{trigger:card||mask.parentElement,containerAnimation:hTween,start:'left 88%',end:'left 35%',scrub:1}});
      if(img){gsap.to(img,{x:'0%',scale:1.04,filter:'brightness(1) blur(0px)',ease:'power2.out',scrollTrigger:{trigger:card||mask.parentElement,containerAnimation:hTween,start:'left 88%',end:'left 30%',scrub:1}})}
    });

    // Card meta stagger
    cards.forEach(function(card){
      var meta=card.querySelector('.hscroll-meta, .port-card-content, .hscroll-cta-inner, .port-cta-inner');
      if(!meta)return;
      gsap.fromTo(meta,{y:40,opacity:0},{y:0,opacity:1,ease:'power2.out',scrollTrigger:{trigger:card,containerAnimation:hTween,start:'left 65%',end:'left 40%',scrub:1}});
    });
  });

  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){ScrollTrigger.refresh()},250)});
}

/* ============================================
   GSAP: VARIED TEXT REVEALS
   ============================================ */
function initTextReveals(){
  if(!window.gsap||!window.ScrollTrigger)return;
  var els=document.querySelectorAll('[data-reveal]');
  els.forEach(function(el){
    var type=el.dataset.reveal;
    var delay=parseFloat(el.dataset.revealDelay)||0;
    el.style.visibility='visible';
    var tl=gsap.timeline({scrollTrigger:{trigger:el,start:'top 88%',toggleActions:'play none none reverse'}});
    switch(type){
      case 'clip-up':
        gsap.set(el,{clipPath:'inset(100% 0% 0% 0%)',y:30,opacity:0});
        tl.to(el,{clipPath:'inset(0% 0% 0% 0%)',y:0,opacity:1,duration:1,delay:delay,ease:'power3.out'});break;
      case 'fade-blur':
        gsap.set(el,{opacity:0,y:20,filter:'blur(12px)'});
        tl.to(el,{opacity:1,y:0,filter:'blur(0px)',duration:1,delay:delay,ease:'power2.out'});break;
      case 'slide-right':
        gsap.set(el,{opacity:0,x:-40});
        tl.to(el,{opacity:1,x:0,duration:.8,delay:delay,ease:'power3.out'});break;
      case 'slide-up':
        gsap.set(el,{opacity:0,y:40});
        tl.to(el,{opacity:1,y:0,duration:.85,delay:delay,ease:'power3.out'});break;
      case 'words':
        var text=el.textContent.trim(),words=text.split(/\s+/);el.innerHTML='';
        words.forEach(function(w){var s=document.createElement('span');s.style.cssText='display:inline-block;overflow:hidden;vertical-align:top;margin-right:.3em;';var inner=document.createElement('span');inner.style.cssText='display:inline-block;';inner.textContent=w;s.appendChild(inner);el.appendChild(s)});
        var inners=el.querySelectorAll('span > span');gsap.set(inners,{y:'110%',opacity:0});
        tl.to(inners,{y:'0%',opacity:1,duration:.7,delay:delay,stagger:.06,ease:'power3.out'});break;
      default:
        gsap.set(el,{opacity:0,y:24});tl.to(el,{opacity:1,y:0,duration:.8,delay:delay,ease:'power2.out'});
    }
  });
}

/* ── Additional GSAP scroll animations ── */
function initScrollAnimations(){
  if(!window.gsap||!window.ScrollTrigger)return;
  var lamp=document.querySelector('.lamp-cone');
  if(lamp){gsap.fromTo(lamp,{y:-60,scale:.9,opacity:0},{y:0,scale:1,opacity:1,scrollTrigger:{trigger:'#mission',start:'top 80%',end:'top 20%',scrub:1}})}
  gsap.utils.toArray('.sc').forEach(function(c,i){gsap.fromTo(c,{y:40,opacity:0},{y:0,opacity:1,duration:.7,delay:i*.08,ease:'power2.out',scrollTrigger:{trigger:c,start:'top 88%',toggleActions:'play none none reverse'}})});
  gsap.utils.toArray('.wc').forEach(function(c,i){gsap.fromTo(c,{y:50,opacity:0,rotateX:8},{y:0,opacity:1,rotateX:0,duration:.8,delay:i*.1,ease:'power3.out',scrollTrigger:{trigger:c,start:'top 85%',toggleActions:'play none none reverse'}})});
  document.querySelectorAll('.stn,.num').forEach(function(el){gsap.fromTo(el,{scale:.8,opacity:0},{scale:1,opacity:1,duration:.8,ease:'back.out(1.7)',scrollTrigger:{trigger:el,start:'top 85%',toggleActions:'play none none reverse'}})});
}

/* ── VORTEX ── */
function initVortex(){
  var canvas=document.getElementById('vortex-c');if(!canvas)return;
  var ctx=canvas.getContext('2d'),angle=0;
  function resize(){canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight}resize();window.addEventListener('resize',resize);
  function draw(){requestAnimationFrame(draw);canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;
    var cx=canvas.width/2,cy=canvas.height/2;ctx.clearRect(0,0,canvas.width,canvas.height);angle+=.007;
    for(var ri=0;ri<18;ri++){var r=(ri+1)*22,dots=50+ri*4,alpha=.025+ri*.004;
      for(var di=0;di<dots;di++){var a=(di/dots)*Math.PI*2+angle*(ri%2===0?1:-1),x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r*.28;
        ctx.beginPath();ctx.arc(x,y,1.5,0,Math.PI*2);ctx.fillStyle='rgba(0,'+Math.floor(100+(ri/18)*132)+','+Math.floor(200+(ri/18)*55)+','+alpha+')';ctx.fill()}}
  }
  var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting)draw()})},{threshold:.1});
  var sec=document.getElementById('vortex');if(sec)obs.observe(sec);else draw();
}

/* ── METEORS ── */
function initMeteors(){
  document.querySelectorAll('.wc').forEach(function(card){
    var rain=card.querySelector('.mtr-rain');if(!rain)return;
    for(var i=0;i<18;i++){var m=document.createElement('div');m.className='mtr';
      m.style.cssText='width:'+(55+Math.random()*80)+'px;top:'+(Math.random()*120)+'%;left:'+(Math.random()*120)+'%;animation-delay:'+(Math.random()*5)+'s;animation-duration:'+(1.5+Math.random()*3)+'s;';
      rain.appendChild(m)}
  });
}

/* ── SERVICES PAGE: EXPANDABLE ── */
function initSubCards(){document.querySelectorAll('.sub-hdr').forEach(function(hdr){hdr.addEventListener('click',function(){var card=hdr.closest('.sub-card'),w=card.classList.contains('open');document.querySelectorAll('.sub-card').forEach(function(c){c.classList.remove('open')});if(!w)card.classList.add('open')})})}

/* ── HAMBURGER MOBILE NAV ── */
function initHamburger(){
  var ham=document.querySelector('.nav-ham');
  var overlay=document.getElementById('nav-overlay');
  if(!ham||!overlay)return;
  
  function toggleMenu(){
    ham.classList.toggle('active');
    overlay.classList.toggle('open');
    document.body.style.overflow=overlay.classList.contains('open')?'hidden':'';
  }
  
  ham.addEventListener('click',toggleMenu);
  
  // Close on link click
  overlay.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click',function(){
      ham.classList.remove('active');
      overlay.classList.remove('open');
      document.body.style.overflow='';
    });
  });
  
  // Close on ESC
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&overlay.classList.contains('open')){
      ham.classList.remove('active');
      overlay.classList.remove('open');
      document.body.style.overflow='';
    }
  });
}

/* ── IFRAME LAZY LOADING ── */
function initIframeLazy(){
  var launchBtns=document.querySelectorAll('.iframe-launch-btn');
  if(!launchBtns.length)return;
  
  launchBtns.forEach(function(btn){
    btn.addEventListener('click',function(){
      var wrap=btn.closest('.srv-iframe-wrap');
      var iframe=wrap.querySelector('iframe');
      var src=btn.dataset.src||iframe.dataset.src;
      if(!src||wrap.classList.contains('iframe-loaded')||wrap.classList.contains('iframe-loading'))return;
      
      // Set loading state
      wrap.classList.add('iframe-loading');
      
      // Set iframe src to start loading
      iframe.src=src;
      
      // Handle iframe load
      iframe.addEventListener('load',function onLoad(){
        iframe.removeEventListener('load',onLoad);
        setTimeout(function(){
          wrap.classList.remove('iframe-loading');
          wrap.classList.add('iframe-loaded');
        },300);
      });
      
      // Fallback timeout (if iframe takes too long or doesn't fire load)
      setTimeout(function(){
        if(!wrap.classList.contains('iframe-loaded')){
          wrap.classList.remove('iframe-loading');
          wrap.classList.add('iframe-loaded');
        }
      },15000);
    });
  });
}

/* ── IFRAME FULLVIEW MODAL ── */
function initIframeFullview(){
  var modal=document.getElementById('iframe-fullview-modal');
  if(!modal)return;
  
  var backdrop=modal.querySelector('.ifm-backdrop');
  var closeBtn=modal.querySelector('.ifm-close');
  var modalIframe=document.getElementById('ifm-iframe');
  var modalTitle=document.getElementById('ifm-title');
  var modalBody=modal.querySelector('.ifm-body');
  
  function openModal(src,title){
    // Set title
    modalTitle.textContent=title||'3D ENGINE // FULL VIEW';
    
    // Lock scroll
    document.body.classList.add('ifm-open');
    if(window.lenis)window.lenis.stop();
    
    // Show modal
    modal.classList.add('open');
    
    // Load iframe
    modalBody.classList.remove('loaded');
    modalIframe.src=src;
    modalIframe.addEventListener('load',function onLoad(){
      modalIframe.removeEventListener('load',onLoad);
      setTimeout(function(){
        modalBody.classList.add('loaded');
      },200);
    });
  }
  
  function closeModal(){
    modal.classList.remove('open');
    document.body.classList.remove('ifm-open');
    if(window.lenis)window.lenis.start();
    
    // Delay iframe removal for animation
    setTimeout(function(){
      modalIframe.src='';
      modalBody.classList.remove('loaded');
    },500);
  }
  
  // Fullview buttons
  document.querySelectorAll('.hud-fullview-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      var wrap=btn.closest('.srv-iframe-wrap');
      var iframe=wrap.querySelector('iframe');
      var hudTitle=wrap.querySelector('.hud-title');
      var src=iframe.src||iframe.dataset.src;
      var title=hudTitle?hudTitle.textContent:'3D ENGINE // FULL VIEW';
      
      if(!src||src==='about:blank')return;
      openModal(src,title);
    });
  });
  
  // Close handlers
  closeBtn.addEventListener('click',closeModal);
  backdrop.addEventListener('click',closeModal);
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&modal.classList.contains('open'))closeModal();
  });
}

/* ── CONTACT FORM ── */
function initForm(){
  var form = document.getElementById('contact-form');
  if(!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var valid = true;
    
    // Validation
    form.querySelectorAll('[required]').forEach(function(f) {
      var wrap = f.closest('.ff') || f.closest('.ct-ff');
      var ok = f.value.trim().length > 0;
      if (f.type === 'email') {
        ok = ok && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value);
      }
      if (wrap) wrap.classList.toggle('err', !ok);
      if (!ok) valid = false;
    });

    if(!valid) return;
    
    var btn = form.querySelector('.btn-submit') || form.querySelector('.ct-btn');
    if (btn) btn.classList.add('loading');

    // 1. Pack up the form data using the exact IDs from your HTML
    var formData = new FormData();
    formData.append('name', document.getElementById('cf-name').value);
    formData.append('email', document.getElementById('cf-email').value);
    formData.append('company', document.getElementById('cf-company').value);
    
    var srv = document.getElementById('cf-service');
    formData.append('service', srv.options[srv.selectedIndex]?.text || '');
    
    var bdg = document.getElementById('cf-budget');
    formData.append('budget', bdg.options[bdg.selectedIndex]?.text || '');
    
    formData.append('message', document.getElementById('cf-msg').value);

    formData.append('access_key', 'f60a742d-fcb8-46e5-9b1d-242d191ad584'); // ← paste your key here

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
    .then(function(response){ return response.json(); })
    .then(function(data){
      if (btn) btn.classList.remove('loading');
      if (data.success) {
        form.style.display = 'none';
        var suc = document.getElementById('form-success');
        if (suc) suc.classList.add('show');
      } else {
        alert('Could not send message: ' + (data.message || 'Unknown error'));
      }
    })
    .catch(function(error){
      if (btn) btn.classList.remove('loading');
      alert('A network error occurred. Please try again later.');
      console.error('Form submission error:', error);
    });
  });

  form.querySelectorAll('input,textarea').forEach(function(el){
    el.addEventListener('input',function(){var w=el.closest('.ff')||el.closest('.ct-ff');if(w)w.classList.remove('err')})
  });
  form.querySelectorAll('select').forEach(function(sel){
    sel.addEventListener('change',function(){sel.value?sel.classList.add('has-value'):sel.classList.remove('has-value')})
  });
}
/* ── MODAL ── */
function initModal(){
  var modal=document.getElementById('reel-modal');if(!modal)return;
  document.querySelectorAll('[data-modal]').forEach(function(btn){btn.addEventListener('click',function(){modal.classList.add('open')})});
  modal.addEventListener('click',function(e){if(e.target===modal||e.target.classList.contains('modal-x'))modal.classList.remove('open')});
}

/* ── LENIS & SMOOTH ANCHOR SCROLLING ── */
function initLenis() {
  if (!window.Lenis) return;

  window.lenis = new Lenis({
    duration: 1.5,
    easing: function (t) {
      return Math.min(1, 1.001 - Math.pow(2, -10 * t));
    },
    orientation: 'vertical',
    smoothWheel: true
  });

  if (window.ScrollTrigger) {
    window.lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      window.lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(t) {
      window.lenis.raf(t);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  document.addEventListener(
    'click',
    function (e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      window.lenis.scrollTo(target, {
        offset: -80,
        duration: 1.5,
        lock: false,
        immediate: false
      });

      history.pushState(null, '', hash);
    },
    { passive: false }
  );
}

/* ── SMART VIDEO PERFORMANCE ── */
function initVideoPerformance() {
  var videos = document.querySelectorAll('video');
  if (videos.length === 0) return;

  // Watch videos and only play them if they are on screen
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        // Video is on screen: Play it
        entry.target.play().catch(function(e) { console.log("Autoplay prevented:", e); });
      } else {
        // Video is off screen: Pause it to save CPU/GPU!
        entry.target.pause();
      }
    });
  }, { threshold: 0.1, rootMargin: "200px 0px" }); // Start playing slightly before it enters the screen

  videos.forEach(function(video) {
    // Ensure videos are muted (required for autoplay in most browsers)
    video.muted = true;
    video.playsInline = true;
    observer.observe(video);
  });
}

/* ── BOOT ── */
document.addEventListener('DOMContentLoaded',function(){
  initCursor();initNav();initHeroCarousel();
  initGrid('hero','h-grid');initCtaGrid();
  initCardSpotlight();initBento();initCounters();
  initVortex();initMeteors();
  initSubCards();initForm();initModal();
  initHamburger();initIframeLazy();initIframeFullview();
  
  // Initialize video pausing right away
  initVideoPerformance();
});

window.addEventListener('load', function() {
  setTimeout(function() {
    document.body.classList.remove('is-loading');
    document.body.classList.add('loaded');
    
    initLenis();
    initReveal();
    setTimeout(function(){
      initHorizontalScroll();
      initTextReveals();
      initScrollAnimations();
      if(window.ScrollTrigger) ScrollTrigger.refresh();
    }, 150);

  }, 500); 
});
})();
