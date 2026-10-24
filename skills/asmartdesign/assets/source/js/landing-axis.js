/**
 * X-axis brand flip — finishes the current rotation before returning on leave.
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function edgeFromEvent(event, el) {
    var rect = el.getBoundingClientRect();
    return event.clientY - rect.top < rect.height / 2 ? "top" : "bottom";
  }

  function bindAxisFlip(root) {
    if (!root || root.dataset.axisReady === "1") return;
    root.dataset.axisReady = "1";

    var hit = root.querySelector(".about-axis__hit");
    var leadInner = root.querySelector(".about-axis__inner");
    if (!hit || !leadInner) return;

    var hovered = false;
    var flipped = false;
    var animating = false;
    var pendingClose = false;

    function setFlipped(next, closing) {
      flipped = next;
      root.classList.toggle("is-flipped", flipped);
      root.classList.toggle("is-closing", !!closing);
      root.classList.add("is-animating");
      animating = true;
    }

    function settle() {
      animating = false;
      root.classList.remove("is-animating");
      root.classList.remove("is-closing");

      if (pendingClose && flipped) {
        pendingClose = false;
        setFlipped(false, true);
        return;
      }

      if (hovered && !flipped) {
        setFlipped(true, false);
        return;
      }

      if (!hovered && flipped) {
        setFlipped(false, true);
        return;
      }

      if (!hovered && !flipped) {
        root.removeAttribute("data-edge");
      }
    }

    leadInner.addEventListener("transitionend", function (event) {
      if (event.propertyName !== "transform") return;
      settle();
    });

    if (reduceMotion || !finePointer) return;

    hit.addEventListener("mouseenter", function (event) {
      hovered = true;
      pendingClose = false;
      root.classList.remove("is-closing");
      root.dataset.edge = edgeFromEvent(event, hit);

      if (!animating && !flipped) {
        setFlipped(true, false);
      }
    });

    hit.addEventListener("mouseleave", function () {
      hovered = false;

      if (animating) {
        pendingClose = true;
        return;
      }

      if (flipped) {
        setFlipped(false, true);
      } else {
        root.removeAttribute("data-edge");
      }
    });
  }

  function init() {
    bindAxisFlip(document.querySelector("[data-axis-flip]"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
