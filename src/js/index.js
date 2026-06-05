window.HELP_IMPROVE_VIDEOJS = false;

// Related Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Copied';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Copied';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Supplementary video autoplay when in view
function setupSupplementaryVideoAutoplay() {
    const carouselVideos = document.querySelectorAll('.supplementary-video-grid video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

function setupSupplementaryVideoTabs() {
    const tabs = document.querySelectorAll('[data-video-scene-tab]');
    const panels = document.querySelectorAll('[data-video-scene-panel]');

    if (!tabs.length || !panels.length) {
        return;
    }

    const setScene = scene => {
        tabs.forEach(tab => {
            const isActive = tab.dataset.videoSceneTab === scene;
            tab.classList.toggle('is-active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        panels.forEach(panel => {
            const isActive = panel.dataset.videoScenePanel === scene;
            panel.classList.toggle('is-active', isActive);
            panel.hidden = !isActive;

            if (!isActive) {
                panel.querySelectorAll('video').forEach(video => {
                    video.pause();
                });
            }
        });
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            setScene(tab.dataset.videoSceneTab);
        });
    });

    setScene('bedroom');
}

function setupResultTabs() {
    const categoryTabs = document.querySelectorAll('[data-result-category-tab]');
    const categoryPanels = document.querySelectorAll('[data-result-category-panel]');
    const metricTabs = document.querySelectorAll('[data-result-metric-tab]');
    const metricPanels = document.querySelectorAll('[data-result-metric-panel]');
    const metricControls = document.querySelector('.result-metric-controls');
    const descriptions = document.querySelectorAll('[data-result-description]');

    if (!categoryTabs.length || !categoryPanels.length) {
        return;
    }

    let activeCategory = 'synthetic';
    let activeMetric = 'albedo';

    const setMetric = metric => {
        activeMetric = metric;

        metricTabs.forEach(tab => {
            const isActive = tab.dataset.resultMetricTab === activeMetric;
            tab.classList.toggle('is-active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            tab.setAttribute('aria-controls', `${activeCategory}-${tab.dataset.resultMetricTab}`);
        });

        metricPanels.forEach(panel => {
            const isActive = panel.dataset.resultMetricPanel === `${activeCategory}:${activeMetric}`;
            panel.classList.toggle('is-active', isActive);
            panel.hidden = !isActive;
        });
    };

    const setCategory = category => {
        activeCategory = category;

        categoryTabs.forEach(tab => {
            const isActive = tab.dataset.resultCategoryTab === activeCategory;
            tab.classList.toggle('is-active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        categoryPanels.forEach(panel => {
            const isActive = panel.dataset.resultCategoryPanel === activeCategory;
            panel.classList.toggle('is-active', isActive);
            panel.hidden = !isActive;
        });

        descriptions.forEach(description => {
            const isActive = description.dataset.resultDescription === activeCategory;
            description.classList.toggle('is-active', isActive);
            description.hidden = !isActive;
        });

        if (metricControls) {
            metricControls.hidden = activeCategory === 'ablation';
        }

        if (activeCategory === 'ablation') {
            metricPanels.forEach(panel => {
                panel.classList.remove('is-active');
                panel.hidden = true;
            });
            return;
        }

        setMetric(activeMetric);
    };

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            setCategory(tab.dataset.resultCategoryTab);
        });
    });

    metricTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            setMetric(tab.dataset.resultMetricTab);
        });
    });

    setCategory(activeCategory);
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize carousel sections when present.
    if (document.querySelector('.carousel')) {
        var carousels = bulmaCarousel.attach('.carousel', options);
    }
	
    bulmaSlider.attach();
    
    // Setup video autoplay and scene switching
    setupSupplementaryVideoAutoplay();
    setupSupplementaryVideoTabs();
    setupResultTabs();

})
