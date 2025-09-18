// Error handler to suppress browser extension related errors
export const suppressExtensionErrors = () => {
  // Override console.error to filter out extension-related errors
  const originalError = console.error;
  
  console.error = (...args) => {
    const message = args.join(' ');
    
    // Filter out common extension-related errors
    if (
      message.includes('Unchecked runtime.lastError') ||
      message.includes('The message port closed before a response was received') ||
      message.includes('Extension context invalidated') ||
      message.includes('Could not establish connection')
    ) {
      return; // Suppress these errors
    }
    
    // Log all other errors normally
    originalError.apply(console, args);
  };

  // Also handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || event.reason || '';
    
    if (
      message.includes('Unchecked runtime.lastError') ||
      message.includes('The message port closed before a response was received') ||
      message.includes('Extension context invalidated') ||
      message.includes('Could not establish connection')
    ) {
      event.preventDefault(); // Prevent the error from showing
      return;
    }
  });
};

// Initialize error suppression
export const initErrorSuppression = () => {
  suppressExtensionErrors();
};
