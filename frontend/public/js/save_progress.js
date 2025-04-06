// Function to load completed problems from local storage
function loadCompletedProblems() {
    const completedProblems = JSON.parse(localStorage.getItem('completedProblems')) || {};
    for (const [problemSlug, isCompleted] of Object.entries(completedProblems)) {
      const checkbox = document.querySelector(`input[data-problem-slug="${problemSlug}"]`);
      if (checkbox) {
        checkbox.checked = isCompleted;
      }
    }
  }

  // Function to save problem completion status to local storage
  function saveProblemCompletion(problemSlug, isChecked) {
    let completedProblems = JSON.parse(localStorage.getItem('completedProblems')) || {};
    completedProblems[problemSlug] = isChecked;
    localStorage.setItem('completedProblems', JSON.stringify(completedProblems));
  }

  // Function to calculate and update the progress for each category
  function updateProgress() {
    const categoryContainers = document.querySelectorAll('[data-category-name]');
    categoryContainers.forEach(container => {
      const categoryName = container.getAttribute('data-category-name');
      // Query all checkboxes with a matching data-category attribute
      const checkboxes = document.querySelectorAll(
        `input[type="checkbox"][data-category="${categoryName}"]`
      );
      const total = checkboxes.length;
      const completed = Array.from(checkboxes).filter(cb => cb.checked).length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      // Update the progress bar and text within this container
      const progressBar = container.querySelector('.progress-bar');
      const progressText = container.querySelector('.progress-text');
      progressBar.style.width = `${percentage}%`;
      progressText.textContent = `${completed}/${total} - ${percentage}% Completed`;
    });
  }

  // Initialize checkboxes and load saved progress when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    loadCompletedProblems();
    updateProgress();

    // Add event listeners to all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', event => {
        const problemSlug = event.target.dataset.problemSlug;
        const isChecked = event.target.checked;
        saveProblemCompletion(problemSlug, isChecked);
        updateProgress();
      });
    });
  });