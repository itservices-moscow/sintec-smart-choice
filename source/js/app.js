"use strict";
const modules_mhzModules = {};
function isWebp() {
    function testWebP(callback) {
        let webP = new Image;
        webP.onload = webP.onerror = function() {
            callback(2 == webP.height);
        };
        webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }
    testWebP((function(support) {
        let className = true === support ? "webp" : "no-webp";
        document.documentElement.classList.add(className);
    }));
}
function getHash() {
    if (location.hash) return location.hash.replace("#", "");
}
let bodyLockStatus = true;
let bodyUnlock = (delay = 500) => {
    let body = document.querySelector("body");
    if (bodyLockStatus) {
        let lock_padding = document.querySelectorAll("[data-lp]");
        setTimeout((() => {
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = "0px";
            }
            body.style.paddingRight = "0px";
            document.documentElement.classList.remove("lock");
        }), delay);
        bodyLockStatus = false;
        setTimeout((function() {
            bodyLockStatus = true;
        }), delay);
    }
};
let bodyLock = (delay = 500) => {
    let body = document.querySelector("body");
    if (bodyLockStatus) {
        let lock_padding = document.querySelectorAll("[data-lp]");
        for (let index = 0; index < lock_padding.length; index++) {
            const el = lock_padding[index];
            el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
        }
        body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
        document.documentElement.classList.add("lock");
        bodyLockStatus = false;
        setTimeout((function() {
            bodyLockStatus = true;
        }), delay);
    }
};
function menuClose() {
    bodyUnlock();
    document.documentElement.classList.remove("menu-open");
}
function functions_FLS(message) {
    setTimeout((() => {
        if (window.FLS) console.log(message);
    }), 0);
}
function uniqArray(array) {
    return array.filter((function(item, index, self) {
        return self.indexOf(item) === index;
    }));
}
let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
    const targetBlockElement = document.querySelector(targetBlock);
    if (targetBlockElement) {
        let headerItem = "";
        let headerItemHeight = 0;
        if (noHeader) {
            headerItem = "header.header";
            headerItemHeight = document.querySelector(headerItem).offsetHeight;
        }
        let options = {
            speedAsDuration: true,
            speed,
            header: headerItem,
            offset: offsetTop,
            easing: "easeOutQuad"
        };
        document.documentElement.classList.contains("menu-open") ? menuClose() : null;
        if ("undefined" !== typeof SmoothScroll) (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
            let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
            targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
            targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
            window.scrollTo({
                top: targetBlockElementPosition,
                behavior: "smooth"
            });
        }
        functions_FLS(`[gotoBlock]: Юхуу...едем к ${targetBlock}`);
    } else functions_FLS(`[gotoBlock]: Ой ой..Такого блока нет на странице: ${targetBlock}`);
};
class ScrollWatcher {
    constructor(props) {
        let defaultConfig = {
            logging: true
        };
        this.config = Object.assign(defaultConfig, props);
        this.observer;
        !document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
    }
    scrollWatcherUpdate() {
        this.scrollWatcherRun();
    }
    scrollWatcherRun() {
        document.documentElement.classList.add("watcher");
        this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
    }
    scrollWatcherConstructor(items) {
        if (items.length) {
            this.scrollWatcherLogging(`Проснулся, слежу за объектами (${items.length})...`);
            let uniqParams = uniqArray(Array.from(items).map((function(item) {
                return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
            })));
            uniqParams.forEach((uniqParam => {
                let uniqParamArray = uniqParam.split("|");
                let paramsWatch = {
                    root: uniqParamArray[0],
                    margin: uniqParamArray[1],
                    threshold: uniqParamArray[2]
                };
                let groupItems = Array.from(items).filter((function(item) {
                    let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
                    let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : "0px";
                    let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
                    if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
                }));
                let configWatcher = this.getScrollWatcherConfig(paramsWatch);
                this.scrollWatcherInit(groupItems, configWatcher);
            }));
        } else this.scrollWatcherLogging("Сплю, нет объектов для слежения. ZzzZZzz");
    }
    getScrollWatcherConfig(paramsWatch) {
        let configWatcher = {};
        if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root); else if ("null" !== paramsWatch.root) this.scrollWatcherLogging(`Эмм... родительского объекта ${paramsWatch.root} нет на странице`);
        configWatcher.rootMargin = paramsWatch.margin;
        if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
            this.scrollWatcherLogging(`Ой ой, настройку data-watch-margin нужно задавать в PX или %`);
            return;
        }
        if ("prx" === paramsWatch.threshold) {
            paramsWatch.threshold = [];
            for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
        } else paramsWatch.threshold = paramsWatch.threshold.split(",");
        configWatcher.threshold = paramsWatch.threshold;
        return configWatcher;
    }
    scrollWatcherCreate(configWatcher) {
        this.observer = new IntersectionObserver(((entries, observer) => {
            entries.forEach((entry => {
                this.scrollWatcherCallback(entry, observer);
            }));
        }), configWatcher);
    }
    scrollWatcherInit(items, configWatcher) {
        this.scrollWatcherCreate(configWatcher);
        items.forEach((item => this.observer.observe(item)));
    }
    scrollWatcherIntersecting(entry, targetElement) {
        if (entry.isIntersecting) {
            !targetElement.classList.contains("_watcher-view") ? targetElement.classList.add("_watcher-view") : null;
            this.scrollWatcherLogging(`Я вижу ${targetElement.classList}, добавил класс _watcher-view`);
        } else {
            targetElement.classList.contains("_watcher-view") ? targetElement.classList.remove("_watcher-view") : null;
            this.scrollWatcherLogging(`Я не вижу ${targetElement.classList}, убрал класс _watcher-view`);
        }
    }
    scrollWatcherOff(targetElement, observer) {
        observer.unobserve(targetElement);
        this.scrollWatcherLogging(`Я перестал следить за ${targetElement.classList}`);
    }
    scrollWatcherLogging(message) {
        this.config.logging ? functions_FLS(`[Наблюдатель]: ${message}`) : null;
    }
    scrollWatcherCallback(entry, observer) {
        const targetElement = entry.target;
        this.scrollWatcherIntersecting(entry, targetElement);
        targetElement.hasAttribute("data-watch-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
        document.dispatchEvent(new CustomEvent("watcherCallback", {
            detail: {
                entry
            }
        }));
    }
}
modules_mhzModules.watcher = new ScrollWatcher({});
let addWindowScrollEvent = false;
function pageNavigation() {
    document.addEventListener("click", pageNavigationAction);
    document.addEventListener("watcherCallback", pageNavigationAction);
    function pageNavigationAction(e) {
        if ("click" === e.type) {
            const targetElement = e.target;
            if (targetElement.closest("[data-goto]")) {
                const gotoLink = targetElement.closest("[data-goto]");
                const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
                const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
                const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
                const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
                let offsetTopMobile;
                if (window.innerWidth > 1020 && window.innerWidth < 1240) offsetTopMobile = gotoLink.dataset.gotoTopMobile ? parseInt(gotoLink.dataset.gotoTopMobile) + 50 : 0; else offsetTopMobile = gotoLink.dataset.gotoTopMobile ? parseInt(gotoLink.dataset.gotoTopMobile) : 0;
                if (gotoLink.dataset.gotoTopMobile && window.innerWidth > 1020) {
                    gotoblock_gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTopMobile);
                    document.querySelectorAll("[data-goto]").forEach((e => {
                        e.classList.remove("_goto-active");
                    }));
                    targetElement.closest("[data-goto]").classList.add("_goto-active");
                } else {
                    gotoblock_gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
                    document.querySelectorAll("[data-goto]").forEach((e => {
                        e.classList.remove("_goto-active");
                    }));
                    targetElement.closest("[data-goto]").classList.add("_goto-active");
                }
                e.preventDefault();
            }
        } else if ("watcherCallback" === e.type && e.detail) {
            const entry = e.detail.entry;
            const targetElement = entry.target;
            if ("navigator" === targetElement.dataset.watch) {
                document.querySelector(`[data-goto]._navigator-active`);
                let navigatorCurrentItem;
                if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`); else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
                    const element = targetElement.classList[index];
                    if (document.querySelector(`[data-goto=".${element}"]`)) {
                        navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
                        break;
                    }
                }
                if (entry.isIntersecting) navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null; else navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
            }
        }
    }
    if (getHash()) {
        let goToHash;
        if (document.querySelector(`[data-goto="#${getHash()}"]`) || document.querySelector(`[data-goto=".${getHash()}"]`)) {
            if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`; else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
            goToHash ? gotoblock_gotoBlock(goToHash, true, 500, 20) : null;
        }
    }
}
setTimeout((() => {
    if (addWindowScrollEvent) {
        let windowScroll = new Event("windowScroll");
        window.addEventListener("scroll", (function(e) {
            document.dispatchEvent(windowScroll);
        }));
    }
}), 0);
document.addEventListener("DOMContentLoaded", (function() {
    const panelTriggers = document.querySelectorAll("[data-panel]");
    panelTriggers.length ? panelsAction(panelTriggers) : null;
}));
function panelsAction(panelTriggers = document.querySelectorAll("[data-panel]")) {
    panelTriggers.forEach((panelTrigger => {
        panelTrigger.addEventListener("click", (e => {
            e.preventDefault();
            if (!"panel" in panelTrigger.dataset) return;
            let selector = panelTrigger.getAttribute("data-panel");
            let target = selector !== (false || void 0) ? document.querySelector(selector) : void 0;
            if (target) {
                document.documentElement.classList.add("panel-open");
                target.classList.add("_active");
                bodyLock();
            }
        }));
    }));
    const panelsCloseButtons = document.querySelectorAll(".rpanel [data-close]");
    panelsCloseButtons.forEach((panelsCloseButton => {
        panelsCloseButton.addEventListener("click", (e => {
            e.preventDefault();
            panelsCloseButton.closest(".rpanel").classList.remove("_active");
            document.documentElement.classList.remove("panel-open");
            bodyUnlock();
        }));
    }));
}
window["FLS"] = true;
isWebp();
pageNavigation();

let slider = null;
const sliderTabsInit = (slider,sliderTabs, newIndex = 0) => {
  const sliderTabsNavLink = document.querySelectorAll('.slider-tabs__link');

  sliderTabsNavLink.forEach((element, index) => {
      element.addEventListener('click', (e) => {
          e.preventDefault();
          changeSliderTabs(index);

      });
  });


  changeSliderTabs(newIndex);
}

const changeSliderTabs = (newIndex = 0) => {
  const sliderTabsNavLink = document.querySelectorAll('.slider-tabs__link');

  sliderTabsNavLink.forEach((element, index) => {
      index !== newIndex ? element.classList.remove('active') : element.classList.add('active');
  });
  slider?.slideTo(newIndex);
};

const showPopup = (selector) => {

  const popup = document.querySelector(`.${selector}`);

  document.body.classList.add('hidden');
  popup.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const sliderTabs = new Swiper(".slider-tabs", {
          slidesPerView: "auto",
          freeMode: true,
          mousewheel: true,
          on: {
            slideChange: function(swiper) {
              if (window.innerWidth <= 991) {
                changeSliderTabs(swiper.realIndex)
              }
            }
          }
      });
      slider = new Swiper(".slider-wrapper", {
          slidesPerView: 1,
          autoHeight: true,
          navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
          },
          on: {
              init: function () {
                  sliderTabsInit(this, sliderTabs);
              },
          }
      });

  slider.on('slideChange', () => {
      changeSliderTabs(slider.realIndex);
      sliderTabs.slideTo(slider.realIndex)
  });

  const popupTriggers = document.querySelectorAll('*[data-popup]'),
      popups = document.querySelectorAll('.popup'),
      popupClose = document.querySelectorAll('.popup-close');

      console.log(popupTriggers)

  if (popupTriggers.length > 0) {
      popupTriggers.forEach(el => {
          el.addEventListener('click', (e) => {
              e.preventDefault();
          });
          el.addEventListener('click',()=>showPopup(el.dataset.popup));
      });
  };

  if (popups.length > 0) {
      popups.forEach(el => {
          el.addEventListener('click', (e) => {
              if (e.target.classList.contains('popup-wrapper')) {
                  document.body.classList.remove('hidden');
                  el.classList.remove('active');
              }
          });
      });
  }

  if (popupClose.length > 0) {
      popups.forEach(el => {
          el.addEventListener('click', (e) => {
              document.body.classList.remove('hidden');
              el.classList.remove('active');
          });
      });
  };

  const pdfButton = document.querySelectorAll('.pdf-mobile');

  if(window.innerWidth < 767){
      if(pdfButton.length > 0){
          pdfButton.forEach(trigger=>{
              trigger.addEventListener('click',(e)=>{
                  window.location.href = trigger.href;
              });
          });
      }
  }
});