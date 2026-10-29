/**
 * Copy buttons: `<button data-copy>` copies the text of the nearest
 * `.code-block pre`. One delegated listener covers every block on the page.
 */
if (!(window as { __ftdsCopy?: boolean }).__ftdsCopy) {
  (window as { __ftdsCopy?: boolean }).__ftdsCopy = true;

  document.addEventListener("click", async (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>(
      "[data-copy]",
    );
    if (!button) return;
    const pre = button.closest(".code-block")?.querySelector("pre");
    if (!pre) return;
    try {
      await navigator.clipboard.writeText(pre.innerText.replace(/\n$/, ""));
    } catch {
      return;
    }
    const label = button.getAttribute("aria-label");
    button.dataset.copied = "";
    button.setAttribute("aria-label", "Copied");
    setTimeout(() => {
      delete button.dataset.copied;
      if (label) button.setAttribute("aria-label", label);
    }, 1500);
  });
}
