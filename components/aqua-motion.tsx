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
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    const reveal = (scope: ParentNode) => {
      const sections = scope instanceof HTMLElement && scope.matches("section")
        ? [scope]
        : Array.from(scope.querySelectorAll<HTMLElement>("section"));

      sections.forEach((section) => {
        if (section.dataset.aquaReady) return;
        section.dataset.aquaReady = "true";
        section.classList.add("aqua-reveal");
        section.querySelectorAll<HTMLElement>("h1, h2, h3").forEach((heading) => {
          heading.classList.add("aqua-heading");
        });
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

  return <>{children}</>;
}
