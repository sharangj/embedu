// Initialize button with user's preferred color
// let changeColor = document.getElementById("");

// chrome.storage.sync.get("color", ({ color }) => {
//   changeColor.style.backgroundColor = color;
// });

const output = document.getElementById("twitch-output");
const iframeOutput = document.getElementById("twitch-iframe-output");
const videoUrl = document.getElementById("twitch-video-url");
const siteUrls = document.getElementById("twitch-site-urls");
const tabLinks = document.getElementsByClassName("tablinks");
const twitchPreviewBtn = document.getElementById("twitch-preview-button");

const embed = (value) => {
  const string = value || "";
  return `<iframe src="${string}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen scrolling="auto"  style="top: 0px; left: 0px; width: 100%; height: 100%;"></iframe>`;
};
output.value = embed();

const validateUrl = (string) => {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url;
};

const setSearchParams = (path, url, type) => {
  const id = path[path.length - 1];
  url.searchParams.set(type, id);
  return url;
};

const getTwitchPlayerUrl = (url, demo) => {
  // Remove the empty strings in array using the filter.
  const pathArray = url.pathname.split("/").filter((ele) => ele);
  const twitchPlayerUrl = demo
    ? new URL("https://user-documentation.madrid.quintype.io/twitch")
    : new URL("https://player.twitch.tv/?autoplay=false");
  if (pathArray.length === 1)
    return setSearchParams(pathArray, twitchPlayerUrl, "channel");

  if (url.pathname.includes("video"))
    return setSearchParams(pathArray, twitchPlayerUrl, "video");

  if (url.pathname.includes("collection"))
    return setSearchParams(pathArray, twitchPlayerUrl, "collection");

  if (url.pathname.includes("clip")) {
    const twitchClipUrl = new URL(
      "https://clips.twitch.tv/embed?autoplay=false"
    );
    return setSearchParams(pathArray, twitchClipUrl, "clip");
  }

  return twitchPlayerUrl;
};

const injectTwitchUrl = (e) => {
  const url = validateUrl(e.target.value);
  if (url) {
    if (url.host.includes("twitch.tv")) {
      const twitchPlayerUrl = getTwitchPlayerUrl(url);
      output.value = embed(twitchPlayerUrl);
      output.dispatchEvent(new Event("change"));
    }
  }
};

const injectTwitchSiteUrls = (e) => {
  const urls = e.target.value;
  const urlsArray = urls.split(",");
  let urlString = "";
  let twitchPlayerUrl;
  urlsArray &&
    urlsArray.forEach((element) => {
      const validatedUrl = validateUrl(element);
      if (validatedUrl) {
        urlString += `&parent=${validatedUrl.host}`;
      }
    });
  const url = validateUrl(videoUrl.value);
  if (url) {
    if (url.host.includes("twitch.tv")) {
      twitchPlayerUrl = getTwitchPlayerUrl(url);
    }
  }
  output.value = embed(`${twitchPlayerUrl}${urlString}`);
  output.dispatchEvent(new Event("change"));
};

const renderIframe = (e) => {
  const inputUrl = validateUrl(videoUrl.value);
  if (inputUrl) {
    if (inputUrl.host.includes("twitch.tv")) {
      const twitchPlayerUrl = getTwitchPlayerUrl(inputUrl);
      iframeOutput.innerHTML = embed(twitchPlayerUrl);
    }
  }
};

const selectTab = (ele) => {
  let tabContent = document.getElementsByClassName("tab-content");
  Array.from(tabContent).forEach((content) => {
    content.style.display = "none";
  });
  Array.from(tabLinks).forEach((link) => {
    link.className = link.className.replace(" active", "");
  });
  const selectedTabDom = document.getElementById(ele.textContent);
  selectedTabDom.style.display = "block";
  ele.className += " active";
};

const redirectToTwitchIframe = (e) => {
  const inputUrl = validateUrl(videoUrl.value);
  if (inputUrl) {
    if (inputUrl.host.includes("twitch.tv")) {
      const twitchPlayerUrl = getTwitchPlayerUrl(inputUrl, true);
      window.open(twitchPlayerUrl, "_blank");
    }
  }
};

videoUrl.onchange = injectTwitchUrl;
siteUrls.onchange = injectTwitchSiteUrls;
//output.onchange = renderIframe;
Array.from(tabLinks).forEach((link, index) => {
  if (index === 0) selectTab(link);
  //link.onclick = (e) => selectTab(e.target);
});
twitchPreviewBtn.onclick = redirectToTwitchIframe;
