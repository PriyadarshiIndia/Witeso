
function showTestCase(caseNumber) {
    document.querySelectorAll("[id^='testcase-']").forEach(panel => panel.classList.add("hidden"));
    document.querySelector("#testcase-" + caseNumber).classList.remove("hidden");

    document.querySelectorAll(".testcase_btns").forEach(tab => tab.classList.remove("bg-gray-300"));
    document.querySelectorAll(".testcase_btns")[caseNumber - 1].classList.add("bg-gray-300");
}