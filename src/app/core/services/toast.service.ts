import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  showError(message: string) {
    if (typeof document !== 'undefined') {
      const toast = document.createElement('div');
      toast.textContent = message;
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.right = '20px';
      // Dark Obsidian aesthetic
      toast.style.backgroundColor = '#0b0f19'; 
      toast.style.color = '#ff4d4d';
      toast.style.border = '1px solid #ff4d4d';
      toast.style.padding = '16px 24px';
      toast.style.borderRadius = '8px';
      toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
      toast.style.zIndex = '9999';
      toast.style.fontFamily = 'sans-serif';
      toast.style.fontWeight = '500';
      toast.style.transition = 'opacity 0.3s ease-in-out';
      
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 5000);
    } else {
      console.error('Toast Error:', message);
    }
  }
}
