document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("submit-btn").addEventListener("click", async function () {
        // Disable the submit button and show spinner
        this.disabled = true;
        document.getElementById("run_btn_icon").classList.add("hidden");
        document.getElementById("run_btn_spinner").classList.remove("hidden");

        try {
            // Get the code, language, and problem slug
            var editor = monaco.editor.getModels()[0];
            var code = editor.getValue();
            var lang = document.getElementById("language-select").value;
            var problem_slug = document.getElementById("problem_slug").value;

            // Prepare form data for submission
            var formData = new FormData();
            formData.append("code", code);
            formData.append("lang", lang);
            formData.append("problem_slug", problem_slug);
            formData.append("csrf_token", document.getElementById("csrf_token").value);

            // Reset all test case statuses to Pending
            document.querySelectorAll("[id^='status-']").forEach(statusDiv => {
                statusDiv.innerHTML = `<strong>Status:</strong> <span class="font-bold">Pending</span>`;
                statusDiv.className = "px-2 border rounded bg-gray-200 text-gray-700";
            });
            document.querySelectorAll("[id^='expected-'], [id^='actual-'], [id^='time-']").forEach(el => {
                el.textContent = "-";
            });

            // Submit code to the Flask API
            const response = await fetch("/api/submit_code", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log("Submission result:", data);

            if (data.error) {
                let statusDiv = document.getElementById(`status-1`);
                statusDiv.innerHTML = `<strong>Status:</strong> <span class="font-bold">${data.error}</span>`;
                throw new Error(data.error);
            }

            // Extract tokens from the response
            const tokens = data;

            // Poll the get_output API every second
            const pollOutput = async (tokens) => {
                const outputFormData = new FormData();
                outputFormData.append("tokens", JSON.stringify(tokens));
                outputFormData.append("csrf_token", document.getElementById("csrf_token").value);

                while (true) {
                    const outputResponse = await fetch("/api/get_output", {
                        method: "POST",
                        body: outputFormData,
                    });

                    const outputData = await outputResponse.json();
                    console.log("Polling results:", outputData);

                    // Process each result in the outputData array
                    for (const [index, result] of outputData.entries()) {
                        let expectedOutput = document.getElementById(`expected-${index + 1}`);
                        let actualOutput = document.getElementById(`actual-${index + 1}`);
                        let timeTaken = document.getElementById(`time-${index + 1}`);
                        let statusDiv = document.getElementById(`status-${index + 1}`);

                        if (expectedOutput && actualOutput && timeTaken && statusDiv) {
                            expectedOutput.textContent = result.expected_output || "-";
                            actualOutput.textContent = result.actual_output || "-";
                            timeTaken.textContent = result.time || "-";

                            // Update status and background color
                            statusDiv.innerHTML = `<strong>Status:</strong> <span class="font-bold">${result.status}</span>`;
                            statusDiv.classList.remove("bg-gray-200", "text-gray-700");

                            if (result.status === "Accepted") {
                                statusDiv.classList.add("bg-green-200", "text-green-800");
                            } else if (result.status === "Wrong Answer") {
                                statusDiv.classList.add("bg-red-200", "text-red-800");
                            } else if (result.status !== "Processing") {
                                statusDiv.classList.add("bg-yellow-200", "text-yellow-800");
                            }
                        }
                    }

                    // Check if all results are no longer "Processing"
                    const allProcessed = outputData.every(result => result.status !== "Processing");
                    if (allProcessed) {
                        break; // Exit the polling loop
                    }

                    // Wait for 1 second before polling again
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            };

            // Start polling
            await pollOutput(tokens);

        } catch (error) {
            console.error("Error during submission or output retrieval:", error);
        } finally {
            // Re-enable the submit button and hide spinner
            this.disabled = false;
            document.getElementById("run_btn_icon").classList.remove("hidden");
            document.getElementById("run_btn_spinner").classList.add("hidden");
        }
    });
});