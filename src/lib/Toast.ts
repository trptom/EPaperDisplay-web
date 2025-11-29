import { Toast } from 'bootstrap'

export function showErrorToast(message: string, title = 'Error') {
  const toastHtml = `
    <div class="toast align-items-center text-bg-danger border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body">
          <strong>${title}:</strong> ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `

  let container = document.getElementById('toast-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'toast-container'
    container.className = 'toast-container position-fixed top-0 end-0 p-3'
    document.body.appendChild(container)
  }

  const wrapper = document.createElement('div')
  wrapper.innerHTML = toastHtml
  const toastEl = wrapper.firstElementChild as HTMLElement
  container.appendChild(toastEl)

  const toast = new Toast(toastEl, { autohide: true, delay: 5000 })
  toast.show()

  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove())
}
