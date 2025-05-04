import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useParams, Link } from 'react-router-dom';
import CountryDetailsPage from '../pages/CountryDetails';
import '@testing-library/jest-dom';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  Link: ({ children }) => <div>{children}</div>,
}));

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaHeart: () => <div>FaHeart</div>,
  FaRegHeart: () => <div>FaRegHeart</div>,
  FaMapMarkerAlt: () => <div>FaMapMarkerAlt</div>,
  FaFlag: () => <div>FaFlag</div>,
  FaLanguage: () => <div>FaLanguage</div>,
  FaMoneyBillWave: () => <div>FaMoneyBillWave</div>,
  FaUsers: () => <div>FaUsers</div>,
  FaGlobe: () => <div>FaGlobe</div>,
  FaArrowLeft: () => <div>FaArrowLeft</div>,
}));

// Mock fetch
global.fetch = vi.fn();

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

describe('CountryDetailsPage', () => {
  const mockCountry = {
    cca3: 'USA',
    name: {
      common: 'United States',
      official: 'United States of America',
      nativeName: { eng: { official: 'United States of America', common: 'United States' } }
    },
    flags: { png: 'flag.png', svg: 'flag.svg' },
    capital: ['Washington D.C.'],
    region: 'Americas',
    subregion: 'Northern America',
    population: 331002651,
    languages: { eng: 'English' },
    currencies: { USD: { name: 'United States dollar', symbol: '$' } },
    latlng: [38, -97],
    borders: ['CAN', 'MEX'],
    timezones: ['UTC-12:00']
  };

  beforeEach(() => {
    useParams.mockReturnValue({ code: 'USA' });
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([mockCountry]),
    });
    localStorage.clear();
  });

  test('renders loading state initially', async () => {
    render(<CountryDetailsPage />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument());
  });

  test('displays country information after loading', async () => {
    render(<CountryDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Washington D.C.')).toBeInTheDocument();
      expect(screen.getByText('331,002,651')).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
    });
  });

  test('handles favorite functionality', async () => {
    render(<CountryDetailsPage />);
    
    await waitFor(() => screen.getByText('Add to Favorites'));
    
    const favoriteButton = screen.getByText('Add to Favorites');
    fireEvent.click(favoriteButton);
    
    expect(screen.getByText('Remove from Favorites')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('favorites'))).toHaveLength(1);
    
    fireEvent.click(favoriteButton);
    expect(screen.getByText('Add to Favorites')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('favorites'))).toHaveLength(0);
  });

  test('displays error message when country not found', async () => {
    fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    render(<CountryDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Country not found.')).toBeInTheDocument();
    });
  });

  test('renders map when coordinates are available', async () => {
    render(<CountryDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByTitle('Google Map')).toBeInTheDocument();
    });
  });

  test('renders border countries links', async () => {
    render(<CountryDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('CAN')).toBeInTheDocument();
      expect(screen.getByText('MEX')).toBeInTheDocument();
    });
  });

  test('handles missing optional data gracefully', async () => {
    const countryWithoutOptionalData = { 
      ...mockCountry,
      capital: undefined,
      subregion: undefined,
      borders: undefined,
    };
    
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([countryWithoutOptionalData]),
    });
    
    render(<CountryDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('N/A')).toBeInTheDocument();
      expect(screen.queryByText('Border Countries:')).not.toBeInTheDocument();
    });
  });

  test('navigation tabs functionality', async () => {
    render(<CountryDetailsPage />);
    
    await waitFor(() => screen.getByText('Overview'));
    
    const governmentTab = screen.getByText('Government - Politics');
    fireEvent.click(governmentTab);
    
    expect(screen.getByText('Government - Politics')).toHaveClass('bg-gray-800');
  });

  test('handles fetch error', async () => {
    fetch.mockRejectedValue(new Error('API Error'));
    render(<CountryDetailsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Country not found.')).toBeInTheDocument();
    });
  });
});