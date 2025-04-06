const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("resultsContainer");

searchInput.addEventListener("input", function (e) {
    const query = e.target.value.trim();
    if (query.length > 4) {
        fetch(`/api/search?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                resultsContainer.innerHTML = "";
                if (data.length > 0) {
                    data.forEach(item => {
                        resultsContainer.innerHTML += `
                  <a href="/latest_oa/${item.slug}" target="_blank" class="group">
                  <div class="bg-neutral-800 rounded-xl p-6 border border-neutral-700 hover:border-green-500 transition-all group animate__animated animate__fadeInUp">
                    <h3 class="text-xl font-bold text-white mb-2">${item.title}</h3>
                    <p class="text-gray-400 mb-2">Company: ${item.company_name}</p>
                    <p class="text-gray-400 mb-2">Date: ${item.date}</p>
                  </div>
                  </a>
                `;
                    });
                } else {
                    resultsContainer.innerHTML = `<p class="text-center text-gray-400">No results found for your search.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching search results:", error);
                resultsContainer.innerHTML = `<p class="text-center text-gray-400">Error fetching results.</p>`;
            });
    } else {
        resultsContainer.innerHTML = "";
    }
});