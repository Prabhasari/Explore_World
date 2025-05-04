import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import AllCountry from '../pages/AllCountry';
import '@testing-library/jest-dom';


// Mock the components
vi.mock('../components/CountryCard', () => ({
  default: ({ country }) => (
    <div data-testid={`country-card-${country.cca3}`} className="country-card">
      {country.name.common}
    </div>
  )
}));

vi.mock('../components/SearchBar', () => ({
  default: ({ onSearch }) => (
    <div data-testid="search-bar">
      <input 
        data-testid="search-input"
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search for a country"
      />
    </div>
  )
}));

vi.mock('../components/FilterMenu', () => ({
  default: ({ onSelectRegion }) => (
    <div data-testid="filter-menu">
      <select 
        data-testid="region-select"
        onChange={(e) => onSelectRegion(e.target.value)}
      >
        <option value="">All Regions</option>
        <option value="Africa">Africa</option>
        <option value="Americas">Americas</option>
        <option value="Asia">Asia</option>
        <option value="Europe">Europe</option>
        <option value="Oceania">Oceania</option>
      </select>
    </div>
  )
}));

vi.mock('../components/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar Component</div>
}));

// Mock fetch API
global.fetch = vi.fn();

describe('AllCountry Component', () => {
  // Sample country data for tests
  const mockCountries = [
    {
      name: { common: 'United States', official: 'United States of America' },
      cca3: 'USA',
      flags: { png: 'usa-flag.png', svg: 'usa-flag.svg' },
      capital: ['Washington, D.C.'],
      region: 'Americas',
      population: 331002651,
      languages: { eng: 'English' }
    },
    {
      name: { common: 'France', official: 'French Republic' },
      cca3: 'FRA',
      flags: { png: 'france-flag.png', svg: 'france-flag.svg' },
      capital: ['Paris'],
      region: 'Europe',
      population: 67391582,
      languages: { fra: 'French' }
    },
    {
      name: { common: 'Japan', official: 'Japan' },
      cca3: 'JPN',
      flags: { png: 'japan-flag.png', svg: 'japan-flag.svg' },
      capital: ['Tokyo'],
      region: 'Asia',
      population: 125836021,
      languages: { jpn: 'Japanese' }
    }
  ];

  beforeEach(() => {
    fetch.mockClear();
    // Default mock for successful API response
    fetch.mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCountries)
      })
    );
  });

  test('renders loading state initially', () => {
    render(<AllCountry />);
    expect(screen.getByText(/Loading countries/i)).toBeInTheDocument();
  });

  test('renders countries after successful API fetch', async () => {
    render(<AllCountry />);
    
    // Wait for the loading state to finish
    await waitFor(() => {
      expect(screen.queryByText(/Loading countries/i)).not.toBeInTheDocument();
    });

    // Check that the countries are rendered
    expect(screen.getByTestId('country-card-USA')).toBeInTheDocument();
    expect(screen.getByTestId('country-card-FRA')).toBeInTheDocument();
    expect(screen.getByTestId('country-card-JPN')).toBeInTheDocument();
  });

  test('renders error message on API fetch failure', async () => {
    // Mock failed API response
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })
    );
    
    render(<AllCountry />);
    
    // Wait for the loading state to finish
    await waitFor(() => {
      expect(screen.queryByText(/Loading countries/i)).not.toBeInTheDocument();
    });
    
    // Check that the error message is displayed
    expect(screen.getByText(/Failed to fetch countries/i)).toBeInTheDocument();
    expect(screen.getByText(/Reset search/i)).toBeInTheDocument();
  });

  test('renders "no countries found" message when API returns empty array', async () => {
    // Mock empty API response
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    );
    
    render(<AllCountry />);
    
    // Wait for the loading state to finish
    await waitFor(() => {
      expect(screen.queryByText(/Loading countries/i)).not.toBeInTheDocument();
    });
    
    // Check that the "no countries found" message is displayed
    expect(screen.getByText(/No countries found matching your criteria/i)).toBeInTheDocument();
    expect(screen.getByText(/Clear filters/i)).toBeInTheDocument();
  });

  test('updates search term and makes API call when search input changes', async () => {
    render(<AllCountry />);
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading countries/i)).not.toBeInTheDocument();
    });
    
    // Reset fetch mock to track new calls
    fetch.mockClear();
    
    // Setup mock for search response
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockCountries[0]])
      })
    );
    
    // Type in search input
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'united' } });
    
    // Check if the correct API call was made
    expect(fetch).toHaveBeenCalledWith("https://restcountries.com/v3.1/name/united?fields=name,flags,capital,region,population,languages,cca3");
    
    // Wait for the new search results
    await waitFor(() => {
      expect(screen.queryByText(/Loading countries/i)).not.toBeInTheDocument();
    });
    
    // Only USA should be shown
    expect(screen.getByTestId('country-card-USA')).toBeInTheDocument();
    expect(screen.queryByTestId('country-card-FRA')).not.toBeInTheDocument();
    expect(screen.queryByTestId('country-card-JPN')).not.toBeInTheDocument();
  });

  test('updates region filter and makes API call when region select changes', async () => {
    render(<AllCountry />);
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading countries/i)).not.toBeInTheDocument();
    });
    
    // Reset fetch mock to track new calls
    fetch.mockClear();
    
    // Setup mock for region response
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockCountries[1]])
      })
    );
    
    // Select a region
    const regionSelect = screen.getByTestId('region-select');
    fireEvent.change(regionSelect, { target: { value: 'Europe' } });
    
    // Check if the correct API call was made
    expect(fetch).toHaveBeenCalledWith("https://restcountries.com/v3.1/region/Europe?fields=name,flags,capital,region,population,languages,cca3");
    
    // Wait for the new filter results
    await waitFor(() => {
      expect(screen.queryByText(/Loading countries/i)).not.toBeInTheDocument();
    });
    
    // Only France should be shown
    expect(screen.queryByTestId('country-card-USA')).not.toBeInTheDocument();
    expect(screen.getByTestId('country-card-FRA')).toBeInTheDocument();
    expect(screen.queryByTestId('country-card-JPN')).not.toBeInTheDocument();
  });

  test('resets search when clicking reset button after error', async () => {
    // Mock failed API response
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })
    );
    
    render(<AllCountry />);
    
    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch countries/i)).toBeInTheDocument();
    });
    
    // Reset fetch mock to track new calls
    fetch.mockClear();
    
    // Setup mock for reset response
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCountries)
      })
    );
    
    // Click reset button
    const resetButton = screen.getByText(/Reset search/i);
    fireEvent.click(resetButton);
    
    // Check if the correct API call was made (default url)
    expect(fetch).toHaveBeenCalledWith("https://restcountries.com/v3.1/all?fields=name,flags,capital,region,population,languages,cca3");
    
    // Wait for the countries to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading countries/i)).not.toBeInTheDocument();
    });
    
    // All countries should be shown
    expect(screen.getByTestId('country-card-USA')).toBeInTheDocument();
    expect(screen.getByTestId('country-card-FRA')).toBeInTheDocument();
    expect(screen.getByTestId('country-card-JPN')).toBeInTheDocument();
  });

  test('clears filters when clicking clear filters button', async () => {
    // Mock empty API response
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    );
    
    render(<AllCountry />);
    
    // Wait for the "no countries found" message
    await waitFor(() => {
      expect(screen.getByText(/No countries found matching your criteria/i)).toBeInTheDocument();
    });
    
    // Reset fetch mock to track new calls
    fetch.mockClear();
    
    // Setup mock for reset response
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCountries)
      })
    );
    
    // Click clear filters button
    const clearButton = screen.getByText(/Clear filters/i);
    fireEvent.click(clearButton);
    
    // Check if the correct API call was made (default url)
    expect(fetch).toHaveBeenCalledWith("https://restcountries.com/v3.1/all?fields=name,flags,capital,region,population,languages,cca3");
    
    // Wait for the countries to load
    await waitFor(() => {
      expect(screen.queryByText(/No countries found matching your criteria/i)).not.toBeInTheDocument();
    });
    
    // All countries should be shown
    expect(screen.getByTestId('country-card-USA')).toBeInTheDocument();
    expect(screen.getByTestId('country-card-FRA')).toBeInTheDocument();
    expect(screen.getByTestId('country-card-JPN')).toBeInTheDocument();
  });

  test('pagination buttons appear when more than 20 countries', async () => {
    // Create array with 25 countries
    const manyCountries = Array(25).fill().map((_, i) => ({
      name: { common: `Country ${i}`, official: `Country ${i} Official` },
      cca3: `C${i.toString().padStart(2, '0')}`,
      flags: { png: 'flag.png', svg: 'flag.svg' },
      capital: [`Capital ${i}`],
      region: 'Region',
      population: 1000000,
      languages: { eng: 'English' }
    }));
    
    // Mock API response with many countries
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(manyCountries)
      })
    );
    
    render(<AllCountry />);
    
    // Wait for the loading state to finish
    await waitFor(() => {
      expect(screen.queryByText(/Loading countries/i)).not.toBeInTheDocument();
    });
    
    // Check pagination buttons are displayed
    expect(screen.getByText(/Previous/i)).toBeInTheDocument();
    expect(screen.getByText(/Next/i)).toBeInTheDocument();
  });

  test('handles search and region selection together correctly', async () => {
    render(<AllCountry />);
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading countries/i)).not.toBeInTheDocument();
    });
    
    // First set search term
    fetch.mockClear();
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockCountries[0]])
      })
    );
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'united' } });
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("https://restcountries.com/v3.1/name/united?fields=name,flags,capital,region,population,languages,cca3");
    });
    
    // Now set region filter - search should take precedence
    fetch.mockClear();
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockCountries[0]])
      })
    );
    
    const regionSelect = screen.getByTestId('region-select');
    fireEvent.change(regionSelect, { target: { value: 'Americas' } });
    
    // Search term should still take precedence
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("https://restcountries.com/v3.1/name/united?fields=name,flags,capital,region,population,languages,cca3");
    });
  });

  test('handles API network error gracefully', async () => {
    // Mock network error
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));
    
    render(<AllCountry />);
    
    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });
});