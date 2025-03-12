/**
 * tool.js - PALM Meeting Tool functionality
 * Part of the Corporate Clarity toolkit
 * https://github.com/Corporate-Clarity/palm-meeting-tool
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const purposeInput = document.getElementById('meeting-purpose');
    const purposeCount = document.getElementById('purpose-count');
    const purposeFeedback = document.getElementById('purpose-feedback');
    const purposeToggle = document.querySelectorAll('.toggle-option');
    const agendaContainer = document.getElementById('agenda-items-container');
    const addAgendaBtn = document.getElementById('add-agenda-item');
    const timeSlider = document.getElementById('time-limit');
    const timeRecommendation = document.getElementById('time-recommendation');
    const totalAttendees = document.getElementById('total-attendees');
    const generateBtn = document.getElementById('generate-btn');
    const meetingTemplate = document.getElementById('meeting-template');
    const themeToggle = document.getElementById('theme-toggle');

    // Cost calculator elements
    const hourlyRate = document.getElementById('hourly-rate');
    const meetingFrequency = document.getElementById('meeting-frequency');
    const timePeriod = document.getElementById('time-period');
    const totalCost = document.getElementById('total-cost');
    const costPerMeeting = document.getElementById('cost-per-meeting');
    const timeWasted = document.getElementById('time-wasted');
    const meetingDuration = document.getElementById('meeting-duration');
    const breakdownAttendees = document.getElementById('breakdown-attendees');
    const breakdownPerMeeting = document.getElementById('breakdown-per-meeting');
    const breakdownAnnual = document.getElementById('breakdown-annual');
    const breakdownAnnualCost = document.getElementById('breakdown-annual-cost');
    const traditionalValue = document.getElementById('traditional-value');
    const palmValue = document.getElementById('palm-value');
    const traditionalBar = document.querySelector('.chart-bar.traditional');
    const palmBar = document.querySelector('.chart-bar.palm');

    // Template elements
    const templatePurpose = document.getElementById('template-purpose');
    const templateAgenda = document.getElementById('template-agenda');
    const templateTime = document.getElementById('template-time');
    const templateAttendees = document.getElementById('template-attendees');
    const copyTemplateBtn = document.getElementById('copy-template-btn');
    const calendarBtn = document.getElementById('calendar-btn');
    const emailBtn = document.getElementById('email-btn');
    const startMeetingBtn = document.getElementById('start-meeting-btn');

    // Export buttons
    const exportPdfBtn = document.getElementById('export-pdf');
    const exportImageBtn = document.getElementById('export-image');
    const exportDataBtn = document.getElementById('export-data');

    // Initialize functionality if elements exist (to prevent errors on About page)
    if (purposeInput) {
        // Event Listeners
        purposeInput.addEventListener('input', updatePurposeCount);
        purposeInput.addEventListener('blur', evaluatePurpose);
        
        purposeToggle.forEach(toggle => {
            toggle.addEventListener('click', () => {
                purposeToggle.forEach(t => t.classList.remove('active'));
                toggle.classList.add('active');
            });
        });
        
        addAgendaBtn.addEventListener('click', addAgendaItem);
        timeSlider.addEventListener('input', updateTimeSlider);
        totalAttendees.addEventListener('input', updateAttendees);
        generateBtn.addEventListener('click', generateTemplate);
        copyTemplateBtn.addEventListener('click', copyTemplate);
        
        // Cost calculator event listeners
        hourlyRate.addEventListener('input', updateCostCalculation);
        meetingFrequency.addEventListener('change', updateCostCalculation);
        timePeriod.addEventListener('change', updateCostCalculation);
        totalAttendees.addEventListener('input', updateCostCalculation);
        timeSlider.addEventListener('input', updateCostCalculation);
        
        // Export button listeners
        if (exportPdfBtn) exportPdfBtn.addEventListener('click', exportPdf);
        if (exportImageBtn) exportImageBtn.addEventListener('click', exportImage);
        if (exportDataBtn) exportDataBtn.addEventListener('click', exportData);
        
        // Template action buttons
        if (calendarBtn) calendarBtn.addEventListener('click', addToCalendar);
        if (emailBtn) emailBtn.addEventListener('click', createEmail);
        if (startMeetingBtn) startMeetingBtn.addEventListener('click', startMeeting);
        
        // Initial calls
        updatePurposeCount();
        updateTimeSlider();
        updateCostCalculation();
        
        // Setup remove buttons for initial agenda items
        setupRemoveButtons();
    }

    // Theme toggle is on both pages
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        // Initialize theme based on user preference or system setting
        initializeTheme();
    }

    // Functions

    /**
     * Initialize theme based on user preference or system setting
     */
    function initializeTheme() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            // Apply saved theme
            document.documentElement.className = savedTheme;
            updateThemeToggleIcon();
        } else {
            // Check if user prefers dark mode
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (prefersDark) {
                document.documentElement.classList.add('dark');
                updateThemeToggleIcon();
            }
        }
    }

    /**
     * Toggle between light and dark themes
     */
    function toggleTheme() {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', '');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        
        updateThemeToggleIcon();
    }

    /**
     * Update the theme toggle icon based on current theme
     */
    function updateThemeToggleIcon() {
        if (!themeToggle) return;
        
        const icon = themeToggle.querySelector('i');
        if (!icon) return;
        
        if (document.documentElement.classList.contains('dark')) {
            icon.className = 'ti ti-sun';
        } else {
            icon.className = 'ti ti-moon';
        }
    }

    /**
     * Update the character count for the purpose field
     */
    function updatePurposeCount() {
        if (!purposeInput || !purposeCount) return;
        
        const length = purposeInput.value.length;
        purposeCount.textContent = length;
    }

    /**
     * Evaluate the purpose statement and provide feedback
     */
    function evaluatePurpose() {
        if (!purposeInput || !purposeFeedback) return;
        
        const purpose = purposeInput.value.toLowerCase();
        const discussWords = ['discuss', 'talk', 'chat', 'explore', 'share', 'brainstorm', 'review'];
        const achieveWords = ['decide', 'determine', 'select', 'choose', 'finalize', 'approve', 'solve', 'resolve', 'agree', 'establish'];
        
        let containsDiscuss = discussWords.some(word => purpose.includes(word));
        let containsAchieve = achieveWords.some(word => purpose.includes(word));
        
        if (containsDiscuss && !containsAchieve) {
            purposeFeedback.innerHTML = '<span class="feedback-icon">⚠️</span><span class="feedback-warning">This sounds like a discussion, not a decision. Consider rephrasing.</span>';
        } else if (containsAchieve) {
            purposeFeedback.innerHTML = '<span class="feedback-icon">✅</span><span class="feedback-good">Good! This purpose is focused on outcomes.</span>';
        } else if (purpose.length > 0) {
            purposeFeedback.innerHTML = '<span class="feedback-icon">ℹ️</span><span>Consider adding a clear decision word like "decide" or "determine".</span>';
        } else {
            purposeFeedback.innerHTML = '';
        }
    }

    /**
     * Add a new agenda item to the list
     */
    function addAgendaItem() {
        if (!agendaContainer) return;
        
        const agendaItem = document.createElement('div');
        agendaItem.className = 'agenda-item';
        agendaItem.innerHTML = `
            <input type="text" class="agenda-input" placeholder="Decision: ">
            <button type="button" class="remove-btn">✕</button>
        `;
        agendaContainer.appendChild(agendaItem);
        
        // Setup remove button for the new item
        setupRemoveButtons();
        
        // Focus the new input
        const inputs = agendaContainer.querySelectorAll('input');
        inputs[inputs.length - 1].focus();
        
        // Update time recommendation
        updateTimeRecommendation();
    }

    /**
     * Setup remove buttons for agenda items
     */
    function setupRemoveButtons() {
        if (!agendaContainer) return;
        
        const removeButtons = agendaContainer.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const agendaItems = agendaContainer.querySelectorAll('.agenda-item');
                if (agendaItems.length > 1) {
                    button.parentElement.remove();
                    updateTimeRecommendation();
                    updateCostCalculation();
                }
            });
        });
    }

    /**
     * Update the time slider display
     */
    function updateTimeSlider() {
        if (!timeSlider || !meetingDuration) return;
        
        const timeValue = timeSlider.value;
        meetingDuration.textContent = `${timeValue} minutes`;
        updateTimeRecommendation();
    }

    /**
     * Update the time recommendation based on number of agenda items
     */
    function updateTimeRecommendation() {
        if (!agendaContainer || !timeRecommendation || !timeSlider) return;
        
        const agendaItems = agendaContainer.querySelectorAll('.agenda-item').length;
        const recommendedTime = Math.min(60, Math.max(15, agendaItems * 10 + 5));
        timeRecommendation.textContent = `Recommended: ${recommendedTime} minutes for ${agendaItems} decision item${agendaItems !== 1 ? 's' : ''}`;
        
        // Update slider value if it's far from recommended
        const currentTime = parseInt(timeSlider.value);
        if (Math.abs(currentTime - recommendedTime) > 15) {
            timeSlider.value = recommendedTime;
            if (meetingDuration) meetingDuration.textContent = `${recommendedTime} minutes`;
        }
    }

    /**
     * Update attendees count display
     */
    function updateAttendees() {
        if (!totalAttendees || !breakdownAttendees) return;
        
        const count = parseInt(totalAttendees.value);
        breakdownAttendees.textContent = `${count} people`;
        updateCostCalculation();
    }

    /**
     * Update cost calculation based on current inputs
     */
    function updateCostCalculation() {
        if (!hourlyRate || !totalAttendees || !timeSlider || !meetingFrequency || !timePeriod) return;
        
        const rate = parseFloat(hourlyRate.value);
        const attendees = parseInt(totalAttendees.value);
        const minutes = parseInt(timeSlider.value);
        const hours = minutes / 60;
        const frequency = parseInt(meetingFrequency.value);
        const period = parseInt(timePeriod.value);
        
        // Calculate costs
        const perMeetingCost = rate * attendees * hours;
        const totalMeetings = frequency * 4 * period; // Assuming 4 weeks per month
        const totalCostValue = perMeetingCost * totalMeetings;
        
        // Calculate traditional meeting costs (typically 35% longer with 25% more people)
        const traditionalMinutes = Math.min(60, Math.ceil(minutes * 1.35));
        const traditionalAttendees = Math.ceil(attendees * 1.25);
        const traditionalHours = traditionalMinutes / 60;
        const traditionalPerMeeting = rate * traditionalAttendees * traditionalHours;
        const traditionalTotal = traditionalPerMeeting * totalMeetings;
        
        // Calculate time wasted
        const wastedMinutesPerMeeting = traditionalMinutes - minutes;
        const wastedHoursPerYear = (wastedMinutesPerMeeting * totalMeetings) / 60;
        
        // Update UI
        if (totalCost) totalCost.textContent = `$${Math.round(totalCostValue).toLocaleString()}`;
        if (costPerMeeting) costPerMeeting.textContent = `$${Math.round(perMeetingCost)} per meeting`;
        if (timeWasted) timeWasted.textContent = `${Math.round(wastedHoursPerYear)} hours`;
        if (breakdownPerMeeting) breakdownPerMeeting.textContent = `$${Math.round(perMeetingCost)}`;
        if (breakdownAnnual) breakdownAnnual.textContent = `${totalMeetings} meetings`;
        if (breakdownAnnualCost) breakdownAnnualCost.textContent = `$${Math.round(totalCostValue).toLocaleString()}`;
        
        // Update comparison chart
        if (traditionalValue) traditionalValue.textContent = `$${Math.round(traditionalTotal).toLocaleString()}`;
        if (palmValue) palmValue.textContent = `$${Math.round(totalCostValue).toLocaleString()}`;
        
        // Adjust bar heights for visual comparison
        if (palmBar && traditionalBar) {
            const maxHeight = 180; // Max bar height in pixels
            const ratio = totalCostValue / traditionalTotal;
            palmBar.style.height = `${maxHeight * ratio}px`;
            traditionalBar.style.height = `${maxHeight}px`;
        }
    }

    /**
     * Generate meeting template based on form inputs
     */
    function generateTemplate() {
        if (!purposeInput || !agendaContainer || !timeSlider || !meetingTemplate) return;
        
        // Get form values
        const purpose = purposeInput.value;
        const agenda = Array.from(agendaContainer.querySelectorAll('.agenda-input')).map(input => input.value);
        const time = timeSlider.value;
        
        // Update template
        if (templatePurpose) templatePurpose.textContent = purpose;
        
        if (templateAgenda) {
            let agendaHTML = '';
            agenda.forEach((item, index) => {
                if (item.trim() !== '') {
                    agendaHTML += `<p>${index + 1}. ${item.startsWith('Decision:') ? item : 'Decision: ' + item}</p>`;
                }
            });
            templateAgenda.innerHTML = agendaHTML;
        }
        
        if (templateTime) templateTime.textContent = `${time} minutes`;
        
        // Show template
        meetingTemplate.style.display = 'block';
        
        // Scroll to template
        meetingTemplate.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Copy template to clipboard
     */
    function copyTemplate() {
        if (!templatePurpose || !templateAgenda || !templateTime || !templateAttendees || !copyTemplateBtn) return;
        
        const template = `
PALM MEETING TEMPLATE

🎯 PURPOSE:
${templatePurpose.textContent}

📝 AGENDA (Decisions to Make):
${templateAgenda.innerText}

⏳ TIME LIMIT:
${templateTime.textContent}

🗂️ REQUIRED ATTENDEES:
${templateAttendees.innerText}

📋 PRE-MEETING PREPARATION:
- Review current channel performance data
- Come prepared with top 3 channel recommendations
- Review budget constraints document

Generated with Corporate Clarity's PALM Meeting Tool
https://palm.corporateclarity.xyz
`.trim();
        
        navigator.clipboard.writeText(template).then(() => {
            // Show copied feedback
            copyTemplateBtn.textContent = 'Copied to Clipboard!';
            setTimeout(() => {
                copyTemplateBtn.textContent = 'Copy Complete Template';
            }, 2000);
        }).catch(err => {
            console.error('Could not copy text: ', err);
            copyTemplateBtn.textContent = 'Error copying to clipboard';
            setTimeout(() => {
                copyTemplateBtn.textContent = 'Copy Complete Template';
            }, 2000);
        });
    }

    /**
     * Export template as PDF (simulation)
     */
    function exportPdf() {
        alert('In a real implementation, this would generate a PDF report of your meeting plan and cost analysis.');
    }

    /**
     * Export cost visualization as image (simulation)
     */
    function exportImage() {
        alert('In a real implementation, this would capture the cost visualization as an image.');
    }

    /**
     * Export cost data as CSV (simulation)
     */
    function exportData() {
        alert('In a real implementation, this would download the meeting cost data as a CSV file.');
    }

    /**
     * Add meeting to calendar (simulation)
     */
    function addToCalendar() {
        const purpose = templatePurpose ? templatePurpose.textContent : 'PALM Meeting';
        const time = templateTime ? templateTime.textContent : '30 minutes';
        
        // Create iCal date format for today at next hour
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours() + 1).padStart(2, '0');
        
        const startDate = `${year}${month}${day}T${hour}0000`;
        const endHour = String(now.getHours() + 2).padStart(2, '0');
        const endDate = `${year}${month}${day}T${endHour}0000`;
        
        const calUrl = `data:text/calendar;charset=utf-8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${encodeURIComponent(purpose)}
DTSTART:${startDate}
DTEND:${endDate}
DESCRIPTION:${encodeURIComponent(`A PALM meeting to ${purpose}. This meeting has been structured to maximize decision-making efficiency.`)}
END:VEVENT
END:VCALENDAR`;
        
        window.open(calUrl);
    }

    /**
     * Create email with meeting details (simulation)
     */
    function createEmail() {
        const purpose = templatePurpose ? templatePurpose.textContent : 'PALM Meeting';
        const agenda = templateAgenda ? templateAgenda.innerText.replace(/\n/g, '%0D%0A') : '';
        const time = templateTime ? templateTime.textContent : '30 minutes';
        const attendees = templateAttendees ? templateAttendees.innerText.replace(/\n/g, '%0D%0A') : '';
        
        const subject = encodeURIComponent(`PALM Meeting: ${purpose}`);
        const body = encodeURIComponent(`
Hi team,

I'm scheduling a focused PALM meeting to ${purpose}.

MEETING DETAILS:
- Purpose: ${purpose}
- Time limit: ${time}
- Required attendees: 
${attendees}

AGENDA (Decisions to make):
${agenda}

PREPARATION:
- Review current channel performance data
- Come prepared with top 3 channel recommendations
- Review budget constraints document

This meeting follows the PALM technique (Purpose, Agenda, Limit, Minimum) designed to maximize decision-making efficiency.

Looking forward to a productive meeting.
        `);
        
        window.open(`mailto:?subject=${subject}&body=${body}`);
    }

    /**
     * Start a meeting now (simulation)
     */
    function startMeeting() {
        const purpose = templatePurpose ? templatePurpose.textContent : 'PALM Meeting';
        alert(`In a real implementation, this would open your default video conferencing tool with the meeting details pre-populated.\n\nMeeting Purpose: ${purpose}`);
    }
});
