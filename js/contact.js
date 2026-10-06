(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const form=document.getElementById('contactForm'); if(!form)return;
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const name=document.getElementById('cname')?.value.trim()||'';
      const contact=document.getElementById('ccontact')?.value.trim()||'';
      const message=document.getElementById('cmsg')?.value.trim()||'';
      const subject=encodeURIComponent(`VERV Website Enquiry — ${name}`);
      const body=encodeURIComponent(`Name: ${name}\nContact: ${contact}\n\nMessage:\n${message}`);
      const to=window.VERV_CONFIG?.CONTACT_EMAIL||'vervofficial1@gmail.com';
      window.location.href=`mailto:${to}?subject=${subject}&body=${body}`;
      if(window.VERV_CHECKOUT?.showNotice)window.VERV_CHECKOUT.showNotice('YOUR MESSAGE IS READY','Your email app will open with the message addressed to VERV. Please press Send in your email app to deliver it.');
    });
  });
})();
