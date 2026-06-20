const copyButtons = document.querySelectorAll("[data-copy-email]");

const copyEmailToClipboard = async (email) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(email);
    return true;
  }

  const tempInput = document.createElement("input");
  tempInput.value = email;
  tempInput.setAttribute("readonly", "");
  tempInput.style.position = "absolute";
  tempInput.style.left = "-9999px";

  document.body.appendChild(tempInput);
  tempInput.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(tempInput);

  return copied;
};

copyButtons.forEach((button) => {
  const feedback = button.closest(".cta-copy")?.querySelector("[data-copy-feedback]");
  let feedbackTimer;

  button.addEventListener("click", async () => {
    const email = button.getAttribute("data-copy-email");

    if (!email || !feedback) {
      return;
    }

    window.clearTimeout(feedbackTimer);

    try {
      await copyEmailToClipboard(email);
      feedback.textContent = "Email copied. You can paste it into Gmail, Outlook, or Apple Mail.";
    } catch (error) {
      feedback.textContent = "Copy failed. Please use the email button above.";
    }

    feedbackTimer = window.setTimeout(() => {
      feedback.textContent = "";
    }, 3200);
  });
});
