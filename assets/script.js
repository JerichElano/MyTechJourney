window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');

    // Wait for one cycle of the looped GIF (adjust to actual GIF cycle duration in milliseconds)
    const gifDuration = 4000; // Placeholder: 3 seconds
    setTimeout(() => {
        mainContent.style.display = 'flex'; // Show main content
        loadingScreen.style.transform = 'translateY(-100%)'; // Slide up
        setTimeout(() => {
            loadingScreen.style.display = 'none'; // Hide after transition
        }, 500); // Match CSS transition duration
    }, gifDuration);
});