import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastr: ToastrService) {}

  showToast(title, body) {
    this.toastr.show(body, title, {
      timeOut: 5000,
      closeButton: true
    });
  }

  showSuccess(title, body) {
    this.toastr.success(body, title, {
      timeOut: 5000,
      closeButton: true,
      positionClass: 'toast-bottom-center'
    });
  }

  showWarning(title, body) {
    this.toastr.warning(body, title, {
      timeOut: 5000,
      closeButton: true,
      positionClass: 'toast-bottom-center'
    });
  }

  showError(title, body) {
    this.toastr.error(body, title, {
      timeOut: 7000,
      closeButton: true,
      positionClass: 'toast-bottom-center'
    });
  }
}
