document.addEventListener("DOMContentLoaded", function () {
    // Select all the code-tab buttons
    const codeTabs = document.querySelectorAll('.code-tab');
    
    // Add click event listener to each button
    codeTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Get the language of the clicked button
            const selectedLang = this.getAttribute('data-lang');
            
            // Remove 'dsa_article_code_active' class from all tabs and code blocks
            codeTabs.forEach(tab => tab.classList.remove('dsa_article_code_active'));
            document.querySelectorAll('.code-block').forEach(block => block.classList.remove('dsa_article_code_active'));
            
            // Add 'dsa_article_code_active' class to the clicked tab
            this.classList.add('dsa_article_code_active');
            
            // Show the corresponding code block for the selected language
            const selectedCodeBlock = document.querySelector(`.code-block[data-lang="${selectedLang}"]`);
            if (selectedCodeBlock) {
                selectedCodeBlock.classList.add('dsa_article_code_active');
            }
        });
    });
});

