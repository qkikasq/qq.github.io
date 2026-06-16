document.addEventListener('DOMContentLoaded', () => {
  const secretTrigger = document.getElementById('secretTrigger');
  const cheatWidget = document.getElementById('cheatWidget');
  const closeBtn = document.getElementById('closeBtn');
  const minBtn = document.getElementById('minBtn');
  const searchInput = document.getElementById('widgetSearchInput');
  const ticketList = document.getElementById('ticketList');
  const widgetContent = document.querySelector('.widget-content');

  // Toggle widget visibility
  secretTrigger.addEventListener('click', () => {
    cheatWidget.classList.toggle('active');
  });

  closeBtn.addEventListener('click', () => {
    cheatWidget.classList.remove('active');
  });

  // Minimize toggle
  minBtn.addEventListener('click', () => {
    cheatWidget.classList.toggle('minimized');
    if (cheatWidget.classList.contains('minimized')) {
      widgetContent.classList.add('hidden');
      minBtn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      `; // Plus sign
    } else {
      widgetContent.classList.remove('hidden');
      minBtn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      `; // Minus sign
    }
  });

  // Copy button action
  ticketList.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('.copy-btn');
    if (!copyBtn) return;

    const commandText = copyBtn.previousElementSibling.textContent;
    navigator.clipboard.writeText(commandText).then(() => {
      const originalHTML = copyBtn.innerHTML;
      // Change icon to checked state
      copyBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34a853" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
      copyBtn.classList.add('copied');

      setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
        copyBtn.classList.remove('copied');
      }, 1500);
    });
  });

  const ticketSelector = document.getElementById('ticketSelector');

  // Apply both ticket selector and search text filter combined
  function applyFilters() {
    const query = searchInput.value.toLowerCase();
    const selectedTicket = ticketSelector.value;
    const items = ticketList.getElementsByClassName('ticket-item');

    Array.from(items).forEach(item => {
      const ticketVal = item.getAttribute('data-ticket');
      const title = item.querySelector('.ticket-title').textContent.toLowerCase();
      const question = item.querySelector('.ticket-question').textContent.toLowerCase();
      const answer = item.querySelector('.ticket-answer').textContent.toLowerCase();

      const matchesSearch = title.includes(query) || question.includes(query) || answer.includes(query);
      const matchesSelector = selectedTicket === 'all' || ticketVal === selectedTicket;

      if (matchesSearch && matchesSelector) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // Filter triggers
  searchInput.addEventListener('input', applyFilters);
  ticketSelector.addEventListener('change', applyFilters);

  // Make Widget Draggable
  dragElement(cheatWidget);

  function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const dragHeader = elmnt.querySelector('.widget-header');
    
    if (dragHeader) {
      dragHeader.onmousedown = dragMouseDown;
    } else {
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      // Check if clicked inside window buttons or search
      if (e.target.closest('.control-btn') || e.target.closest('.widget-search')) {
        return;
      }
      e.preventDefault();
      // Get the mouse cursor position at startup
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // Call a function whenever the cursor moves
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // Calculate the new cursor position
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      
      // Calculate new position
      let newTop = elmnt.offsetTop - pos2;
      let newLeft = elmnt.offsetLeft - pos1;

      // Constrain position to screen boundaries
      if (newTop < 0) newTop = 0;
      if (newLeft < 0) newLeft = 0;
      if (newTop + elmnt.offsetHeight > window.innerHeight) {
        newTop = window.innerHeight - elmnt.offsetHeight;
      }
      if (newLeft + elmnt.offsetWidth > window.innerWidth) {
        newLeft = window.innerWidth - elmnt.offsetWidth;
      }

      // Apply coordinates (disable bottom/right default alignments if set)
      elmnt.style.bottom = 'auto';
      elmnt.style.right = 'auto';
      elmnt.style.top = newTop + "px";
      elmnt.style.left = newLeft + "px";
    }

    function closeDragElement() {
      // Stop moving when mouse button is released
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
});
