import { e as bodyLockStatus, f as bodyLockToggle } from "./common.min.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function menuInit() {
  document.addEventListener("click", function(e) {
    if (bodyLockStatus && e.target.closest("[data-fls-menu]")) {
      if (window.innerWidth < 768) {
        bodyLockToggle();
      }
      document.documentElement.toggleAttribute("data-fls-menu-open");
    }
  });
}
document.querySelector("[data-fls-menu]") ? window.addEventListener("load", menuInit) : null;
function preloader() {
  const preloaderImages = document.querySelectorAll("img");
  const htmlDocument = document.documentElement;
  const isPreloaded = localStorage.getItem(location.href) && document.querySelector('[data-fls-preloader="true"]');
  if (preloaderImages.length && !isPreloaded) {
    let setValueProgress = function(progress2) {
      showPecentLoad ? showPecentLoad.innerText = `${progress2}%` : null;
      showLineLoad ? showLineLoad.style.width = `${progress2}%` : null;
    }, imageLoaded = function() {
      imagesLoadedCount++;
      progress = Math.round(100 / preloaderImages.length * imagesLoadedCount);
      const intervalId = setInterval(() => {
        counter >= progress ? clearInterval(intervalId) : setValueProgress(++counter);
        counter >= 100 ? addLoadedClass() : null;
      }, 10);
    };
    const preloaderTemplate = `
			<div class="fls-preloader">
				<div class="fls-preloader__body">
					<div class="fls-preloader__counter">0%</div>
					<div class="fls-preloader__line"><span></span></div>
				</div>
			</div>`;
    document.body.insertAdjacentHTML("beforeend", preloaderTemplate);
    document.querySelector(".fls-preloader");
    const showPecentLoad = document.querySelector(".fls-preloader__counter"), showLineLoad = document.querySelector(".fls-preloader__line span");
    let imagesLoadedCount = 0;
    let counter = 0;
    let progress = 0;
    htmlDocument.setAttribute("data-fls-preloader-loading", "");
    htmlDocument.setAttribute("data-fls-scrolllock", "");
    preloaderImages.forEach((preloaderImage) => {
      const imgClone = document.createElement("img");
      if (imgClone) {
        imgClone.onload = imageLoaded;
        imgClone.onerror = imageLoaded;
        preloaderImage.dataset.src ? imgClone.src = preloaderImage.dataset.src : imgClone.src = preloaderImage.src;
      }
    });
    setValueProgress(progress);
    const preloaderOnce = () => localStorage.setItem(location.href, "preloaded");
    document.querySelector('[data-fls-preloader="true"]') ? preloaderOnce() : null;
  } else {
    addLoadedClass();
  }
  function addLoadedClass() {
    htmlDocument.setAttribute("data-fls-preloader-loaded", "");
    htmlDocument.removeAttribute("data-fls-preloader-loading");
    htmlDocument.removeAttribute("data-fls-scrolllock");
  }
}
document.addEventListener("DOMContentLoaded", preloader);
function getHours() {
  const now = /* @__PURE__ */ new Date();
  const hours = now.getHours();
  return hours;
}
function darkliteInit() {
  const htmlBlock = document.documentElement;
  const saveUserTheme = localStorage.getItem("fls-user-theme");
  let userTheme;
  if (document.querySelector("[data-fls-darklite-time]")) {
    let customRange = document.querySelector("[data-fls-darklite-time]").dataset.flsDarkliteTime;
    customRange = customRange || "18,5";
    const timeFrom = +customRange.split(",")[0];
    const timeTo = +customRange.split(",")[1];
    console.log(timeFrom);
    userTheme = getHours() >= timeFrom && getHours() <= timeTo ? "dark" : "light";
  } else {
    if (window.matchMedia) {
      userTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      !saveUserTheme ? changeTheme() : null;
    });
  }
  const themeButton = document.querySelector("[data-fls-darklite-set]");
  const resetButton = document.querySelector("[data-fls-darklite-reset]");
  if (themeButton) {
    themeButton.addEventListener("click", function(e) {
      changeTheme(true);
    });
  }
  if (resetButton) {
    resetButton.addEventListener("click", function(e) {
      localStorage.setItem("fls-user-theme", "");
    });
  }
  function setThemeClass() {
    htmlBlock.setAttribute(`data-fls-darklite-${saveUserTheme ? saveUserTheme : userTheme}`, "");
  }
  setThemeClass();
  function changeTheme(saveTheme = false) {
    let currentTheme = htmlBlock.hasAttribute("data-fls-darklite-light") ? "light" : "dark";
    let newTheme;
    if (currentTheme === "light") {
      newTheme = "dark";
    } else if (currentTheme === "dark") {
      newTheme = "light";
    }
    htmlBlock.removeAttribute(`data-fls-darklite-${currentTheme}`);
    htmlBlock.setAttribute(`data-fls-darklite-${newTheme}`, "");
    saveTheme ? localStorage.setItem("fls-user-theme", newTheme) : null;
  }
}
document.querySelector("[data-fls-darklite]") ? window.addEventListener("load", darkliteInit) : null;
