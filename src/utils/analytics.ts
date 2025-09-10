// Google Analytics utility functions

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackPageView = (page_path: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("config", "G-Z95RLHJ17F", {
      page_path: page_path,
    });
  }
};

// Common event tracking functions
export const trackButtonClick = (buttonName: string, location: string) => {
  trackEvent("click", "button", `${buttonName} - ${location}`);
};

export const trackFormSubmit = (formName: string) => {
  trackEvent("submit", "form", formName);
};

export const trackDownload = (fileName: string) => {
  trackEvent("download", "file", fileName);
};

export const trackExternalLink = (url: string) => {
  trackEvent("click", "external_link", url);
};
