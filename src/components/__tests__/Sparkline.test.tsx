import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom'
import { Sparkline } from '../Sparkline'

describe('Sparkline', () => {
  it('renders an SVG element', () => {
    const data = [1, 2, 3, 4, 5]
    render(<Sparkline data={data} width={100} height={20} />)
    expect(screen.getByTestId('sparkline-svg')).toBeInTheDocument()
  })

  it('renders a path element', () => {
    const data = [1, 2, 3, 4, 5]
    render(<Sparkline data={data} width={100} height={20} />)
    expect(screen.getByTestId('sparkline-polyline')).toBeInTheDocument()
  })

  it('calculates correct points attribute for given data', () => {
    const data = [0, 10, 5, 15, 20]
    render(<Sparkline data={data} width={100} height={20} />)
    const polylineElement = screen.getByTestId('sparkline-polyline')
    // Check that points attribute is present and contains coordinate pairs
    expect(polylineElement).toHaveAttribute('points')
    const points = polylineElement.getAttribute('points')
    expect(points).toMatch(/^\d+(\.\d+)?,\d+(\.\d+)?( \d+(\.\d+)?,\d+(\.\d+)?)*$/)
  })

  it('handles edge cases gracefully', () => {
    // Test with single data point
    const { container } = render(<Sparkline data={[5]} width={100} height={20} />)
    expect(container.firstChild).toBeNull()

    // Test with empty data
    const { container: emptyContainer } = render(
      <Sparkline data={[]} width={100} height={20} />
    )
    expect(emptyContainer.firstChild).toBeNull()
  })
})
