import html2canvas from "./html2canvas";

function _screenshot(canvas) {
  const url = canvas.toDataURL("image/png");

  if (!!window.ActiveXObject || "ActiveXObject" in window) {
    const bufferString = window.atob(url.split(",")[1]);
    let len = bufferString.length;
    const uint8 = new Uinit8Array(len);

    while (len--) {
      uint8[len] = url.charCodeAt(len);
    }
    const blob = new Blob([uint8]);
    window.navigator.msSaveOrOpenBlob(blob, "screen.png");
  } else {
    const save_link = document.createElement("a");
    save_link.href = url;
    save_link.download = "screen";
    const event = document.createEvent("MouseEvents");

    event.initMouseEvent(
      "click",
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );
    save_link.dispatchEvent(event);
  }
}

export default {
  methods: {
    mixins_exportCanvas(canvas) {
      _screenshot(canvas);
    }
  }
};
