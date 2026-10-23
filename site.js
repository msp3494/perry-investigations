(function(){
  const btn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');

  function closeNav(){
    if(!btn || !nav) return;
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded','false');
    btn.setAttribute('aria-label','Open navigation');
  }

  if(btn && nav){
    btn.addEventListener('click', function(){
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });

    nav.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function(event){
      if(event.key === 'Escape') closeNav();
    });
  }

  function showToast(message){
    let toast = document.getElementById('siteToast');
    if(!toast){
      toast = document.createElement('div');
      toast.id = 'siteToast';
      toast.className = 'site-toast';
      toast.setAttribute('role','status');
      toast.setAttribute('aria-live','polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(window.__paiToastTimer);
    window.__paiToastTimer = setTimeout(function(){
      toast.classList.remove('show');
    }, 2600);
  }

  const likelyPhoneDevice =
    /Android|iPhone|iPod|Mobile/i.test(navigator.userAgent) ||
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

  document.querySelectorAll('a[href^="tel:"]').forEach(function(link){
    link.addEventListener('click', function(event){
      if(likelyPhoneDevice) return;

      event.preventDefault();
      const displayNumber = '(508) 556-3075';

      if(navigator.clipboard && window.isSecureContext){
        navigator.clipboard.writeText(displayNumber).then(function(){
          showToast('Phone number copied: ' + displayNumber);
        }).catch(function(){
          window.prompt('Call Perry Advisory & Investigations:', displayNumber);
        });
      } else {
        window.prompt('Call Perry Advisory & Investigations:', displayNumber);
      }
    });
  });

  const form = document.getElementById('consultForm');
  if(form){
    form.addEventListener('submit', function(event){
      event.preventDefault();

      if(!form.reportValidity()) return;

      const data = new FormData(form);
      const subjectText = 'Confidential Consultation - ' + (data.get('name') || 'Website Inquiry');
      const bodyText =
        'Name: ' + (data.get('name') || '') + '\n' +
        'Organization / Law Firm: ' + (data.get('organization') || '') + '\n' +
        'Email: ' + (data.get('reply') || '') + '\n' +
        'Phone: ' + (data.get('phone') || '') + '\n' +
        'Matter Type: ' + (data.get('type') || '') + '\n\n' +
        'Brief Message:\n' + (data.get('message') || '');

      const recipient = 'jeff@perryinvestigationsllc.com';
      const encodedSubject = encodeURIComponent(subjectText);
      const encodedBody = encodeURIComponent(bodyText);

      const emailApp = document.getElementById('openEmailApp');
      const gmail = document.getElementById('openGmail');
      const copyButton = document.getElementById('copyPreparedMessage');
      const options = document.getElementById('emailOptions');

      if(emailApp){
        emailApp.href = 'mailto:' + recipient + '?subject=' + encodedSubject + '&body=' + encodedBody;
      }

      if(gmail){
        gmail.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' +
          encodeURIComponent(recipient) + '&su=' + encodedSubject + '&body=' + encodedBody;
      }

      if(copyButton){
        copyButton.onclick = function(){
          const prepared =
            'To: ' + recipient + '\n' +
            'Subject: ' + subjectText + '\n\n' +
            bodyText;

          if(navigator.clipboard && window.isSecureContext){
            navigator.clipboard.writeText(prepared).then(function(){
              showToast('Prepared email copied to your clipboard.');
            }).catch(function(){
              window.prompt('Copy the prepared email below:', prepared);
            });
          } else {
            window.prompt('Copy the prepared email below:', prepared);
          }
        };
      }

      if(options){
        options.hidden = false;
        options.scrollIntoView({behavior:'smooth', block:'nearest'});
        const heading = options.querySelector('h3');
        if(heading) heading.focus({preventScroll:true});
      }
    });
  }
})();
