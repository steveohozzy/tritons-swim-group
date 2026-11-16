"use client";

import { useEffect } from "react";

export function AquaMotion({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.querySelector("main");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!root || reducedMotion) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -55px 0px" });

    const reveal = (scope: ParentNode) => {
      const sections = scope instanceof HTMLElement && scope.matches("section")
        ? [scope]
        : Array.from(scope.querySelectorAll<HTMLElement>("section"));

      sections.forEach((section) => {
        if (section.dataset.aquaReady) return;
        section.dataset.aquaReady = "true";
        section.classList.add("aqua-reveal");

        const isHero = section === root.querySelector("#top > section:first-child");
        const heading = isHero ? null : section.querySelector<HTMLElement>("h1, h2");
        heading?.classList.add("aqua-heading");

        if (section.children.length > 1) {
          Array.from(section.children).forEach((child) => {
            if (child instanceof HTMLElement && child.tagName === "DIV") {
              child.classList.add("aqua-item");
            }
          });
        }

        section.querySelectorAll<HTMLElement>("article").forEach((item) => {
          item.classList.add("aqua-item");
        });

        if (!isHero) {
          section.querySelectorAll<HTMLElement>("img").forEach((image) => {
            image.classList.add("aqua-media");
          });
        }

        observer.observe(section);
      });
    };

    reveal(root);
    const mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) reveal(node);
      }));
    });
    mutationObserver.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <>
      <div className="aqua-bubble-layer" aria-hidden="true">
        {Array.from({ length: 14 }, (_, index) => <span key={index} />)}
      </div>
      {children}
    </>
  );
}
