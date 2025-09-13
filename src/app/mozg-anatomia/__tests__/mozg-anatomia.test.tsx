import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom'
import MozaAnatomiaPage from '../page'

describe('MozaAnatomiaPage', () => {
  it('renders the main heading', () => {
    render(<MozaAnatomiaPage />)
    expect(
      screen.getByRole('heading', { level: 1, name: /Anatomia mózgu/i })
    ).toBeInTheDocument()
  })

  // Add more tests for region navigator and overlay functionality here
})
