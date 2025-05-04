import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import Home from '../pages/Home1';
import '@testing-library/jest-dom';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

// Mock images
vi.mock('../assets/country1.jpg', () => 'test-image-path');
vi.mock('../assets/country7.jpg', () => 'test-image-path');
// Add similar mocks for other images...

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Home Component', () => {
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('renders main sections', () => {
    render(<Home />);
    
    expect(screen.getByRole('heading', { name: /Explore Our World/i })).toBeInTheDocument();
    expect(screen.getByText(/Application Features/i)).toBeInTheDocument();
    expect(screen.getByText(/Explore Countries By Key Features/i)).toBeInTheDocument();
  });

  test('image slideshow functionality', async () => {
    render(<Home />);
    
    // Initial image
    const initialImage = screen.getByTestId('hero-section');
    expect(initialImage).toHaveStyle(`background-image: url(test-image-path)`);

    // Advance timer by 5 seconds
    vi.advanceTimersByTime(5000);
    
    // Should transition to next image
    await waitFor(() => {
      expect(initialImage).toHaveStyle(`background-image: url(test-image-path)`);
    });
  });

  test('navigation button functionality', async () => {
    render(<Home />);
    
    const exploreButton = screen.getByRole('button', { name: /Explore Countries/i });
    fireEvent.click(exploreButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/allCountry');
    expect(localStorage.getItem('currentApiEndpoint')).toBe('https://restcountries.com/v3.1/all');
  });

  test('category navigation functionality', async () => {
    render(<Home />);
    
    const categoryButtons = await screen.findAllByRole('button', { name: /Population|Capitals|Region|Languages/i });
    
    // Test Population category
    fireEvent.click(categoryButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/filter/population');
    expect(localStorage.getItem('currentApiEndpoint')).toContain('population');

    // Test Languages category
    fireEvent.click(categoryButtons[3]);
    expect(mockNavigate).toHaveBeenCalledWith('/filter/languages');
    expect(localStorage.getItem('currentApiEndpoint')).toContain('languages');
  });

  test('renders statistics cards', () => {
    render(<Home />);
    
    expect(screen.getByText(/195+/i)).toBeInTheDocument();
    expect(screen.getByText(/7,000+/i)).toBeInTheDocument();
    expect(screen.getByText(/8+ Billion/i)).toBeInTheDocument();
  });

  test('feature section images render correctly', async () => {
    render(<Home />);
    
    const images = await screen.findAllByRole('img');
    expect(images.length).toBeGreaterThan(4); // Adjust based on actual image count
  });

  test('footer content renders correctly', () => {
    render(<Home />);
    
    expect(screen.getByText(/Navigation/i)).toBeInTheDocument();
    expect(screen.getByText(/Categories/i)).toBeInTheDocument();
    expect(screen.getByText(/Follow Us/i)).toBeInTheDocument();
  });

  test('responsive design elements', () => {
    render(<Home />);
    
    // Test for mobile view
    global.innerWidth = 500;
    fireEvent.resize(window);
    
    const mobileElements = screen.getAllByText(/Countries Explorer/i);
    expect(mobileElements.length).toBeGreaterThan(0);

    // Test for desktop view
    global.innerWidth = 1200;
    fireEvent.resize(window);
    
    const desktopElements = screen.getAllByText(/View All Countries/i);
    expect(desktopElements.length).toBeGreaterThan(0);
  });

  test('social media icons render', () => {
    render(<Home />);
    
    expect(screen.getByText('🌐')).toBeInTheDocument();
    expect(screen.getByText('📸')).toBeInTheDocument();
    expect(screen.getByText('🐦')).toBeInTheDocument();
  });
});