import './address-overlay.css'
import type { AddressSuggestion, AddressSuggestionOverlayState } from '../../shared/address-suggestions.js'

interface BronomAddressOverlayViewApi {
  onState(listener: (state: AddressSuggestionOverlayState) => void): () => void
  select(suggestionId: string): void
  measured(height: number): void
}

declare global {
  interface Window {
    bronomAddressOverlayView: BronomAddressOverlayViewApi
  }
}

function requiredRoot(): HTMLElement {
  const element = document.querySelector<HTMLElement>('#address-overlay-root')
  if (!element) throw new Error('Address overlay root is unavailable')
  return element
}

const root = requiredRoot()

let selectedSuggestionId: string | null = null

function suggestionMeta(suggestion: AddressSuggestion): string {
  if (suggestion.kind === 'bookmark') return 'Bookmark'
  return suggestion.visitCount && suggestion.visitCount > 1 ? `History · ${suggestion.visitCount} visits` : 'History'
}

function selectSuggestion(suggestionId: string): void {
  if (selectedSuggestionId === suggestionId) return
  selectedSuggestionId = suggestionId
  window.bronomAddressOverlayView.select(suggestionId)
  window.setTimeout(() => {
    if (selectedSuggestionId === suggestionId) selectedSuggestionId = null
  }, 0)
}

function suggestionButton(suggestion: AddressSuggestion, index: number, selectedIndex: number): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'address-suggestion'
  button.dataset.suggestionId = suggestion.id
  button.setAttribute('role', 'option')
  button.setAttribute('aria-selected', String(index === selectedIndex))
  if (index === selectedIndex) button.classList.add('selected')

  const icon = document.createElement('span')
  icon.className = `address-suggestion-icon kind-${suggestion.kind}`
  icon.setAttribute('aria-hidden', 'true')
  icon.textContent = suggestion.kind === 'bookmark' ? '★' : '↶'

  const copy = document.createElement('span')
  copy.className = 'address-suggestion-copy'
  const title = document.createElement('strong')
  title.textContent = suggestion.title
  const address = document.createElement('span')
  address.textContent = suggestion.url
  copy.append(title, address)

  const meta = document.createElement('small')
  meta.textContent = suggestionMeta(suggestion)
  button.append(icon, copy, meta)
  button.addEventListener('pointerdown', (event) => {
    event.preventDefault()
    selectSuggestion(suggestion.id)
  })
  button.addEventListener('click', (event) => {
    event.preventDefault()
    selectSuggestion(suggestion.id)
  })
  return button
}

function render(state: AddressSuggestionOverlayState): void {
  document.documentElement.dataset.theme = state.theme
  selectedSuggestionId = null
  const panel = document.createElement('section')
  panel.className = 'address-suggestions'
  panel.setAttribute('role', 'listbox')
  panel.setAttribute('aria-label', 'Local address suggestions')

  const list = document.createElement('div')
  list.className = 'address-suggestion-list'
  state.suggestions.forEach((suggestion, index) => {
    list.append(suggestionButton(suggestion, index, state.selectedIndex))
  })

  const footer = document.createElement('footer')
  const local = document.createElement('span')
  local.textContent = 'Local only'
  const scopes = document.createElement('span')
  for (const scope of ['@bookmarks', '@history']) {
    const key = document.createElement('kbd')
    key.textContent = scope
    scopes.append(key)
  }
  footer.append(local, scopes)
  panel.append(list, footer)
  root.replaceChildren(panel)

  window.requestAnimationFrame(() => {
    const selected = panel.querySelector<HTMLElement>('.address-suggestion.selected')
    selected?.scrollIntoView({ block: 'nearest' })
    window.bronomAddressOverlayView.measured(Math.ceil(panel.scrollHeight + 2))
  })
}

window.bronomAddressOverlayView.onState(render)
