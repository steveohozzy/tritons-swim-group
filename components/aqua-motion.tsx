"use client";

import { useEffect } from "react";

export function AquaMotion({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.querySelector("main");
    if (!root || reducedMotion) return;

    const reveal = (scope: ParentNode) => {
      scope.querySelectorAll<HTMLElement>("section:not([data-aqua-ready])").forEach((section) => {
        section.dataset.aquaReady = "true";
        section.classList.add("aqua-reveal");
        section.querySelectorAll<HTMLElement>("h1, h2, h3").forEach((heading) => {
          heading.classList.add("aqua-heading");
        });
        observer.observe(section);
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    reveal(root);
    const mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          if (node.matches("section")) reveal({ querySelectorAll: (selector: string) => node.matches(selector) ? [node] : node.querySelectorAll(selector) } as ParentNode);
          reveal(node);
        }
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
